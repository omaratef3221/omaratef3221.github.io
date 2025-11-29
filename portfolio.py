import sys
import os
import json
import requests
from datetime import datetime, timedelta
from flask import Blueprint, jsonify, request
from flask_cors import cross_origin
import time

# Add the Manus API client to the path
sys.path.append('/opt/.manus/.sandbox-runtime')
try:
    from data_api import ApiClient
    MANUS_API_AVAILABLE = True
except ImportError:
    MANUS_API_AVAILABLE = False
    print("Warning: Manus API client not available")

# Import scholarly for Google Scholar
try:
    from scholarly import scholarly
    SCHOLARLY_AVAILABLE = True
except ImportError:
    SCHOLARLY_AVAILABLE = False
    print("Warning: scholarly package not available")

portfolio_bp = Blueprint('portfolio', __name__)

# In-memory cache for API results
cache = {}
CACHE_DURATION = 3600  # 1 hour in seconds

def is_cache_valid(cache_key):
    """Check if cached data is still valid"""
    if cache_key not in cache:
        return False
    
    cached_time = cache[cache_key].get('timestamp', 0)
    return (time.time() - cached_time) < CACHE_DURATION

def get_cached_data(cache_key):
    """Get data from cache if valid"""
    if is_cache_valid(cache_key):
        return cache[cache_key]['data']
    return None

def set_cache_data(cache_key, data):
    """Store data in cache with timestamp"""
    cache[cache_key] = {
        'data': data,
        'timestamp': time.time()
    }

@portfolio_bp.route('/linkedin/<username>', methods=['GET'])
@cross_origin()
def get_linkedin_profile(username):
    """Get LinkedIn profile data using Manus API Hub"""
    cache_key = f"linkedin_{username}"
    
    # Check cache first
    cached_data = get_cached_data(cache_key)
    if cached_data:
        return jsonify(cached_data)
    
    if not MANUS_API_AVAILABLE:
        return jsonify({
            'error': 'LinkedIn API not available',
            'fallback': True,
            'data': get_fallback_linkedin_data()
        }), 200
    
    try:
        # Initialize the API client
        client = ApiClient()
        
        # Call the LinkedIn profile API
        profile_data = client.call_api('LinkedIn/get_user_profile_by_username', 
                                     query={'username': username})
        
        # Process and structure the data
        processed_data = process_linkedin_data(profile_data)
        
        # Cache the result
        set_cache_data(cache_key, processed_data)
        
        return jsonify(processed_data)
        
    except Exception as e:
        print(f"Error fetching LinkedIn profile: {str(e)}")
        return jsonify({
            'error': str(e),
            'fallback': True,
            'data': get_fallback_linkedin_data()
        }), 200

def process_linkedin_data(raw_data):
    """Process raw LinkedIn API data into structured format"""
    if not raw_data or 'error' in raw_data:
        return get_fallback_linkedin_data()
    
    # Handle different response formats
    data = raw_data
    if raw_data.get('success') == True:
        data = raw_data.get('data', {})
    
    processed = {
        'name': f"{data.get('firstName', '')} {data.get('lastName', '')}".strip(),
        'headline': data.get('headline', ''),
        'summary': data.get('summary', ''),
        'location': data.get('geo', {}).get('full', ''),
        'profilePicture': data.get('profilePicture', ''),
        'experience': [],
        'education': [],
        'skills': []
    }
    
    # Process experience
    positions = data.get('position', [])
    for pos in positions:
        experience = {
            'title': pos.get('title', ''),
            'company': pos.get('companyName', ''),
            'location': pos.get('location', ''),
            'description': pos.get('description', ''),
            'startDate': format_linkedin_date(pos.get('start', {})),
            'endDate': format_linkedin_date(pos.get('end', {})) if pos.get('end', {}).get('year', 0) != 0 else 'Present',
            'duration': calculate_duration(pos.get('start', {}), pos.get('end', {}))
        }
        processed['experience'].append(experience)
    
    # Process education
    educations = data.get('educations', [])
    for edu in educations:
        education = {
            'school': edu.get('schoolName', ''),
            'degree': edu.get('degree', ''),
            'fieldOfStudy': edu.get('fieldOfStudy', ''),
            'startDate': format_linkedin_date(edu.get('start', {})),
            'endDate': format_linkedin_date(edu.get('end', {})),
            'description': edu.get('description', '')
        }
        processed['education'].append(education)
    
    # Process skills
    skills = data.get('skills', [])
    for skill in skills:
        skill_data = {
            'name': skill.get('name', ''),
            'endorsements': skill.get('endorsementsCount', 0)
        }
        processed['skills'].append(skill_data)
    
    return processed

def format_linkedin_date(date_obj):
    """Format LinkedIn date object to readable string"""
    if not date_obj:
        return ''
    
    year = date_obj.get('year', 0)
    month = date_obj.get('month', 0)
    
    if year == 0:
        return ''
    
    if month == 0:
        return str(year)
    
    return f"{month:02d}/{year}"

def calculate_duration(start_date, end_date):
    """Calculate duration between two LinkedIn date objects"""
    if not start_date or start_date.get('year', 0) == 0:
        return ''
    
    start_year = start_date.get('year', 0)
    start_month = start_date.get('month', 1)
    
    if not end_date or end_date.get('year', 0) == 0:
        # Current position
        end_year = datetime.now().year
        end_month = datetime.now().month
    else:
        end_year = end_date.get('year', 0)
        end_month = end_date.get('month', 12)
    
    total_months = (end_year - start_year) * 12 + (end_month - start_month)
    
    if total_months < 12:
        return f"{total_months} months"
    else:
        years = total_months // 12
        months = total_months % 12
        if months == 0:
            return f"{years} year{'s' if years > 1 else ''}"
        else:
            return f"{years} year{'s' if years > 1 else ''} {months} month{'s' if months > 1 else ''}"

def get_fallback_linkedin_data():
    """Fallback LinkedIn data for Omar when API is not available"""
    return {
        'name': 'Omar Elgendy',
        'headline': 'Machine Learning Engineer | Data Scientist',
        'summary': 'Experienced Machine Learning Engineer and Data Scientist with 5+ years of delivering production-ready AI solutions across Machine Learning, Natural Language Processing, and Computer Vision.',
        'location': 'Dubai, United Arab Emirates',
        'profilePicture': '',
        'experience': [
            {
                'title': 'Machine Learning Engineer',
                'company': 'Virtue Therapy',
                'location': 'Dubai, UAE',
                'description': 'Developed and deployed production-grade LLM applications achieving over 85% accuracy. Fine-tuned transformer models with QLoRA and LoRA, improving task accuracy by up to 18%.',
                'startDate': '01/2023',
                'endDate': 'Present',
                'duration': '2 years'
            },
            {
                'title': 'Junior Machine Learning Engineer',
                'company': 'Virtue Therapy',
                'location': 'Dubai, UAE',
                'description': 'Built ML models for user behavior prediction, improving engagement insights by 30%. Led end-to-end ML workflows using Scikit-learn, TensorFlow, and PyTorch.',
                'startDate': '02/2021',
                'endDate': '12/2022',
                'duration': '1 year 11 months'
            },
            {
                'title': 'Research Assistant',
                'company': 'University of Sharjah',
                'location': 'Sharjah, UAE',
                'description': 'Authored 6+ peer-reviewed AI research papers with over 350 total citations. Developed optimized Arabic text summarization approach reducing training time by 45%.',
                'startDate': '08/2020',
                'endDate': '01/2021',
                'duration': '6 months'
            }
        ],
        'education': [
            {
                'school': 'University of Sharjah',
                'degree': 'Master of Science',
                'fieldOfStudy': 'Computer Engineering (AI)',
                'startDate': '2019',
                'endDate': '2021',
                'description': 'Specialized in Artificial Intelligence and Machine Learning'
            }
        ],
        'skills': [
            {'name': 'Python', 'endorsements': 45},
            {'name': 'Machine Learning', 'endorsements': 38},
            {'name': 'TensorFlow', 'endorsements': 32},
            {'name': 'PyTorch', 'endorsements': 29},
            {'name': 'Natural Language Processing', 'endorsements': 25}
        ]
    }

@portfolio_bp.route('/github/<username>', methods=['GET'])
@cross_origin()
def get_github_profile(username):
    """Get GitHub profile and repositories data"""
    cache_key = f"github_{username}"

    # Check cache first
    cached_data = get_cached_data(cache_key)
    if cached_data:
        return jsonify(cached_data)

    try:
        # Get user profile
        profile_response = requests.get(f'https://api.github.com/users/{username}')
        profile_response.raise_for_status()
        profile_data = profile_response.json()

        # Get repositories
        repos_response = requests.get(f'https://api.github.com/users/{username}/repos?sort=stars&per_page=20')
        repos_response.raise_for_status()
        repos_data = repos_response.json()

        # Process the data
        processed_data = {
            'profile': {
                'name': profile_data.get('name', ''),
                'bio': profile_data.get('bio', ''),
                'location': profile_data.get('location', ''),
                'company': profile_data.get('company', ''),
                'blog': profile_data.get('blog', ''),
                'avatar_url': profile_data.get('avatar_url', ''),
                'public_repos': profile_data.get('public_repos', 0),
                'followers': profile_data.get('followers', 0),
                'following': profile_data.get('following', 0),
                'created_at': profile_data.get('created_at', ''),
                'updated_at': profile_data.get('updated_at', '')
            },
            'repositories': []
        }

        # Process repositories
        for repo in repos_data:
            if not repo.get('fork', False):  # Exclude forked repositories
                repo_data = {
                    'name': repo.get('name', ''),
                    'description': repo.get('description', ''),
                    'html_url': repo.get('html_url', ''),
                    'language': repo.get('language', ''),
                    'stars': repo.get('stargazers_count', 0),
                    'forks': repo.get('forks_count', 0),
                    'watchers': repo.get('watchers_count', 0),
                    'size': repo.get('size', 0),
                    'created_at': repo.get('created_at', ''),
                    'updated_at': repo.get('updated_at', ''),
                    'topics': repo.get('topics', [])
                }
                processed_data['repositories'].append(repo_data)

        # Sort repositories by stars
        processed_data['repositories'].sort(key=lambda x: x['stars'], reverse=True)

        # Cache the result
        set_cache_data(cache_key, processed_data)

        return jsonify(processed_data)

    except requests.exceptions.RequestException as e:
        print(f"Error fetching GitHub data: {str(e)}")
        return jsonify({
            'error': str(e),
            'fallback': True,
            'data': get_fallback_github_data()
        }), 200

@portfolio_bp.route('/github/<username>/starred', methods=['GET'])
@cross_origin()
def get_github_starred(username):
    """Get GitHub starred repositories"""
    cache_key = f"github_starred_{username}"

    # Check cache first
    cached_data = get_cached_data(cache_key)
    if cached_data:
        return jsonify(cached_data)

    try:
        # Get starred repositories
        starred_response = requests.get(f'https://api.github.com/users/{username}/starred?per_page=20')
        starred_response.raise_for_status()
        starred_data = starred_response.json()

        # Process starred repositories
        starred_repos = []
        for repo in starred_data[:10]:  # Limit to top 10 starred repos
            repo_data = {
                'name': repo.get('name', ''),
                'description': repo.get('description', ''),
                'html_url': repo.get('html_url', ''),
                'language': repo.get('language', ''),
                'stars': repo.get('stargazers_count', 0),
                'forks': repo.get('forks_count', 0),
                'owner': repo.get('owner', {}).get('login', ''),
                'owner_avatar': repo.get('owner', {}).get('avatar_url', ''),
                'topics': repo.get('topics', []),
                'created_at': repo.get('created_at', ''),
                'updated_at': repo.get('updated_at', '')
            }
            starred_repos.append(repo_data)

        processed_data = {
            'starred_repositories': starred_repos,
            'total_starred': len(starred_data)
        }

        # Cache the result
        set_cache_data(cache_key, processed_data)

        return jsonify(processed_data)

    except requests.exceptions.RequestException as e:
        print(f"Error fetching GitHub starred data: {str(e)}")
        return jsonify({
            'error': str(e),
            'starred_repositories': []
        }), 200

@portfolio_bp.route('/github/<username>/pinned', methods=['GET'])
@cross_origin()
def get_github_pinned(username):
    """Get GitHub pinned repositories from user profile"""
    cache_key = f"github_pinned_{username}"

    # Check cache first
    cached_data = get_cached_data(cache_key)
    if cached_data:
        return jsonify(cached_data)

    try:
        # GitHub doesn't have a direct API for pinned repos
        # We'll fetch user's repos and return the top ones by stars

        # Get all user repositories
        repos_response = requests.get(f'https://api.github.com/users/{username}/repos?per_page=100&sort=updated')
        repos_response.raise_for_status()
        repos_data = repos_response.json()

        # Filter out forked repos and sort by stars
        user_repos = [repo for repo in repos_data if not repo.get('fork', False)]
        user_repos.sort(key=lambda x: x.get('stargazers_count', 0), reverse=True)

        # Process top 6 repositories (typical pinned repos count)
        pinned_repos = []
        for repo in user_repos[:6]:
            repo_data = {
                'name': repo.get('name', ''),
                'description': repo.get('description', ''),
                'html_url': repo.get('html_url', ''),
                'language': repo.get('language', ''),
                'stars': repo.get('stargazers_count', 0),
                'forks': repo.get('forks_count', 0),
                'owner': repo.get('owner', {}).get('login', ''),
                'owner_avatar': repo.get('owner', {}).get('avatar_url', ''),
                'topics': repo.get('topics', []),
                'created_at': repo.get('created_at', ''),
                'updated_at': repo.get('updated_at', '')
            }
            pinned_repos.append(repo_data)

        processed_data = {
            'pinned_repositories': pinned_repos,
            'total_pinned': len(pinned_repos)
        }

        # Cache the result
        set_cache_data(cache_key, processed_data)

        return jsonify(processed_data)

    except requests.exceptions.RequestException as e:
        print(f"Error fetching GitHub pinned data: {str(e)}")
        return jsonify({
            'error': str(e),
            'pinned_repositories': get_fallback_pinned_repos()
        }), 200

def get_fallback_pinned_repos():
    """Fallback pinned repos data"""
    return [
        {
            'name': 'pytorch_tutorials',
            'description': 'Comprehensive PyTorch exercises from beginner to advanced level',
            'html_url': 'https://github.com/omaratef3221/pytorch_tutorials',
            'language': 'Python',
            'stars': 73,
            'forks': 30,
            'owner': 'omaratef3221',
            'topics': ['pytorch', 'machine-learning', 'deep-learning']
        },
        {
            'name': 'SQL_Query_Generator_llm',
            'description': 'SQL Query generator using Qwen2-1.5B instruct model',
            'html_url': 'https://github.com/omaratef3221/SQL_Query_Generator_llm',
            'language': 'Python',
            'stars': 8,
            'forks': 3,
            'owner': 'omaratef3221',
            'topics': ['llm', 'sql', 'nlp']
        },
        {
            'name': 'podcast-summarizer-agent',
            'description': 'LLMs, RAGs, MongoDB, Chatbot, Flutter Mobile app integration',
            'html_url': 'https://github.com/omaratef3221/podcast-summarizer-agent',
            'language': 'Python',
            'stars': 6,
            'forks': 0,
            'owner': 'omaratef3221',
            'topics': ['rag', 'llm', 'mongodb', 'flutter']
        }
    ]

def get_fallback_github_data():
    """Fallback GitHub data for Omar when API is not available"""
    return {
        'profile': {
            'name': 'Omar Elgendy',
            'bio': 'Machine Learning Engineer | Data Scientist',
            'location': 'Dubai, UAE',
            'company': 'Virtue Therapy',
            'blog': '',
            'avatar_url': '',
            'public_repos': 15,
            'followers': 25,
            'following': 30,
            'created_at': '2020-01-01T00:00:00Z',
            'updated_at': '2024-01-01T00:00:00Z'
        },
        'repositories': [
            {
                'name': 'pytorch_tutorials',
                'description': 'Comprehensive PyTorch exercises from beginner to advanced level',
                'html_url': 'https://github.com/omaratef3221/pytorch_tutorials',
                'language': 'Python',
                'stars': 73,
                'forks': 30,
                'watchers': 73,
                'size': 1024,
                'created_at': '2022-01-01T00:00:00Z',
                'updated_at': '2024-01-01T00:00:00Z',
                'topics': ['pytorch', 'machine-learning', 'deep-learning']
            },
            {
                'name': 'SQL_Query_Generator_llm',
                'description': 'SQL Query generator using Qwen2-1.5B instruct model',
                'html_url': 'https://github.com/omaratef3221/SQL_Query_Generator_llm',
                'language': 'Python',
                'stars': 8,
                'forks': 3,
                'watchers': 8,
                'size': 512,
                'created_at': '2023-01-01T00:00:00Z',
                'updated_at': '2024-01-01T00:00:00Z',
                'topics': ['llm', 'sql', 'nlp']
            },
            {
                'name': 'podcast-summarizer-agent',
                'description': 'LLMs, RAGs, MongoDB, Chatbot, Flutter Mobile app integration',
                'html_url': 'https://github.com/omaratef3221/podcast-summarizer-agent',
                'language': 'Python',
                'stars': 6,
                'forks': 0,
                'watchers': 6,
                'size': 256,
                'created_at': '2023-06-01T00:00:00Z',
                'updated_at': '2024-01-01T00:00:00Z',
                'topics': ['rag', 'llm', 'mongodb', 'flutter']
            }
        ]
    }

@portfolio_bp.route('/scholar/<author_id>', methods=['GET'])
@cross_origin()
def get_scholar_profile(author_id):
    """Get Google Scholar profile and top publications"""
    cache_key = f"scholar_{author_id}"
    
    # Check cache first
    cached_data = get_cached_data(cache_key)
    if cached_data:
        return jsonify(cached_data)
    
    if not SCHOLARLY_AVAILABLE:
        return jsonify({
            'error': 'Google Scholar API not available',
            'fallback': True,
            'data': get_fallback_scholar_data()
        }), 200
    
    try:
        # Search for author by ID
        author = scholarly.search_author_id(author_id)
        author = scholarly.fill(author)
        
        # Get publications and sort by citations
        publications = []
        for pub in author.get('publications', []):
            try:
                pub_filled = scholarly.fill(pub)
                pub_data = {
                    'title': pub_filled.get('bib', {}).get('title', ''),
                    'authors': pub_filled.get('bib', {}).get('author', ''),
                    'venue': pub_filled.get('bib', {}).get('venue', ''),
                    'year': pub_filled.get('bib', {}).get('pub_year', ''),
                    'citations': pub_filled.get('num_citations', 0),
                    'url': pub_filled.get('pub_url', ''),
                    'abstract': pub_filled.get('bib', {}).get('abstract', '')
                }
                publications.append(pub_data)
            except Exception as e:
                print(f"Error processing publication: {e}")
                continue
        
        # Sort by citations and get top 4
        publications.sort(key=lambda x: x['citations'], reverse=True)
        top_publications = publications[:4]

        processed_data = {
            'profile': {
                'name': author.get('name', ''),
                'affiliation': author.get('affiliation', ''),
                'interests': author.get('interests', []),
                'email_domain': author.get('email_domain', ''),
                'citedby': author.get('citedby', 0),
                'hindex': author.get('hindex', 0),
                'i10index': author.get('i10index', 0),
                'url_picture': author.get('url_picture', ''),
                'scholar_url': f'https://scholar.google.com/citations?user={author_id}&hl=en'
            },
            'top_publications': top_publications,
            'total_publications': len(publications)
        }
        
        # Cache the result
        set_cache_data(cache_key, processed_data)
        
        return jsonify(processed_data)
        
    except Exception as e:
        print(f"Error fetching Google Scholar data: {str(e)}")
        return jsonify({
            'error': str(e),
            'fallback': True,
            'data': get_fallback_scholar_data()
        }), 200

def get_fallback_scholar_data():
    """Fallback Google Scholar data for Omar when API is not available"""
    return {
        'profile': {
            'name': 'Omar Elgendy',
            'affiliation': 'University of Sharjah',
            'interests': ['Machine Learning', 'Natural Language Processing', 'Computer Vision'],
            'email_domain': '@gmail.com',
            'citedby': 350,
            'hindex': 3,
            'i10index': 2,
            'url_picture': '',
            'scholar_url': 'https://scholar.google.com/citations?user=lw70gLkAAAAJ&hl=en'
        },
        'top_publications': [
            {
                'title': 'Arabic fake news detection based on deep contextualized embedding models',
                'authors': 'A. B. Nassif, A. Elnagar, O. Elgendy, Y. Afadar',
                'venue': 'Neural Computing and Applications',
                'year': '2022',
                'citations': 89,
                'url': 'https://doi.org/10.1007/s00521-022-07206-4',
                'abstract': 'This paper presents a comprehensive approach for Arabic fake news detection using deep contextualized embedding models.'
            },
            {
                'title': 'Alzheimer Detection using Different Deep Learning Methods with MRI Images',
                'authors': 'O. Elgendy, A. B. Nassif',
                'venue': '2023 Advances in Science and Engineering Technology International Conferences (ASET)',
                'year': '2023',
                'citations': 45,
                'url': 'https://ieeexplore.ieee.org/document/10180640/',
                'abstract': 'This study explores various deep learning approaches for Alzheimer\'s disease detection using MRI images.'
            },
            {
                'title': 'Heart Failure Prediction using Machine learning with Meta-heuristic feature selection techniques',
                'authors': 'O. Elgendy, A. B. Nassif, B. Soudan',
                'venue': 'The 2024 OkIP International Conference on Advances in Health Information Technology (AHIT)',
                'year': '2024',
                'citations': 12,
                'url': 'https://doi.org/10.55432/978-1-6692-0007-9_4',
                'abstract': 'This research presents a novel approach for heart failure prediction using machine learning combined with meta-heuristic feature selection.'
            },
            {
                'title': 'Text Toxicity Level Detection using Deep Contextualized Embedding Models',
                'authors': 'O. Elgendy, A. B. Nassif, B. Soudan',
                'venue': 'The 2024 OkIP International Conference on Advances in Health Information Technology (AHIT)',
                'year': '2024',
                'citations': 8,
                'url': 'https://doi.org/10.55432/978-1-6692-0007-9_3',
                'abstract': 'This paper presents an approach for detecting toxicity levels in text using deep contextualized embedding models.'
            }
        ],
        'total_publications': 6
    }

@portfolio_bp.route('/cache/clear', methods=['POST'])
@cross_origin()
def clear_cache():
    """Clear all cached data"""
    global cache
    cache = {}
    return jsonify({'message': 'Cache cleared successfully'})

@portfolio_bp.route('/cache/status', methods=['GET'])
@cross_origin()
def cache_status():
    """Get cache status"""
    cache_info = {}
    for key, value in cache.items():
        cache_info[key] = {
            'timestamp': value['timestamp'],
            'age_seconds': time.time() - value['timestamp'],
            'valid': is_cache_valid(key)
        }

    return jsonify({
        'cache_count': len(cache),
        'cache_info': cache_info
    })

@portfolio_bp.route('/contact', methods=['POST'])
@cross_origin()
def send_contact_message():
    """Handle contact form submissions"""
    try:
        data = request.get_json()

        # Validate required fields
        required_fields = ['name', 'email', 'subject', 'message']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({
                    'success': False,
                    'error': f'Missing required field: {field}'
                }), 400

        # Extract form data
        name = data.get('name')
        email = data.get('email')
        subject = data.get('subject')
        message = data.get('message')

        # For now, we'll just log the message and return success
        # In production, you would send an email using SMTP or a service like SendGrid
        print(f"""
        New Contact Form Submission:
        ============================
        Name: {name}
        Email: {email}
        Subject: {subject}
        Message: {message}
        ============================
        """)

        # Here you can add email sending logic
        # Example with SendGrid or SMTP:
        # send_email(to='omaratef3221@gmail.com', from_email=email,
        #            subject=subject, body=message, sender_name=name)

        return jsonify({
            'success': True,
            'message': 'Your message has been sent successfully! I will get back to you soon.'
        }), 200

    except Exception as e:
        print(f"Error processing contact form: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'An error occurred while sending your message. Please try again.'
        }), 500

