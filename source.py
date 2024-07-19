'''
Playwright setup
Have it navigate to wallstreet bets
navigate to the top posts of the day
scrape the top 3 posts for 
'''

from playwright.sync_api import sync_playwright, Playwright
import time

def scroll_to_bottom(page):
    page.evaluate('window.scrollTo(0, document.body.scrollHeight)')
    time.sleep(3)  # Wait for comments to load

def scrape_post_comments(page, post_url, max_users=3):
    users = set()
    page.goto(post_url)
    time.sleep(3) #Wait for the page to load

    #Has page loaded comments?
    last_height = page.evaluate('document.body.scrollHeight')

    while True:

        #Expand all 'load more comments' buttons if present
        while True:
            # Expand all 'View more comments' buttons if present
            load_more = page.query_selector('button:has-text("View more comments")')
            if load_more:
                load_more.click()
                time.sleep(3)
            else:
                break

        scroll_to_bottom(page)

        # Check if height of the page has increased (comments loading)
        new_height = page.evaluate('document.body.scrollHeight')

        if new_height == last_height:
            break
        last_height = new_height
    
    comments = page.query_selector_all('a[href^="/user/"]')
    print(comments)
    print(f'Found {len(comments)} user elements')

    for user_element in comments:
        user_url = user_element.get_attribute('href')
        username = user_url.split('/')[-2] #Extract username from URL
        users.add(username)

        if len(users) >= max_users:
            print(f'Reached maximum number of users: {max_users}')
            return users
    
    return users

def scrape_subreddit(subreddit, num_posts=10):
    users = set()

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False, slow_mo=50)
        #Creates a new browser context. It won't share cookies/cache with other browser contexts.
        context = browser.new_context()
        page = context.new_page()
        page.goto(f'https://www.reddit.com/r/{subreddit}/')
        time.sleep(2)

        posts = page.query_selector_all('a[data-post-click-location="comments-button"]')
        post_urls = []

        #Gets links to all comment sections
        for post in posts[:num_posts]:
            href = post.get_attribute('href')
            if href and href.startswith('/r/'):
                full_url = f'https://www.reddit.com{href}'
                if f'/r/{subreddit}/' in full_url:
                    post_urls.append(full_url)
            
        
        #print(post_urls)

        if post_urls:
            print("getting posts")
        else:
            print('no posts')

        for post_url in post_urls:
            post_users = scrape_post_comments(page, post_url)
            users.update(post_users)
        
        browser.close()
    
    return list(users)

def scrape_user_activity(username):
    user_subreddits = set()

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        context = browser.new_context()
        page = context.new_page()
        page.goto(f'https://www.reddit.com/user/{username}')

        #scroll to load more activity
        for _ in range(5):
            page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
            time.sleep(2)
        
        posts = page.query_selector_all('div.Post')

        for post in posts:
            subreddit_element = post.query_selector('a[href^="/r/"]')
            if subreddit_element:
                subreddit_url = subreddit_element.get_attribute('href')

                #get the subreddit name
                subreddit_name = subreddit_url.split('/')[-2]

                user_subreddits.add(subreddit_name)
        
        browser.close()
    
    return list(user_subreddits)

subreddit_to_scrape = 'wallstreetbets'
num_posts_to_scrape = 1

users = scrape_subreddit(subreddit_to_scrape, num_posts_to_scrape)
print(users)

user_subreddit_interactions = {}
for user in users:
    user_subreddit_interactions[user] = scrape_user_activity(user)


print(user_subreddit_interactions)