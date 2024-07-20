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

    while len(users) < max_users:

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

        last_height = page.evaluate('document.body.scrollHeight')
        while True:
            page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
            time.sleep(3)
            new_height = page.evaluate('document.body.scrollHeight')
            if new_height == last_height:
                break
            last_height = new_height

        subreddit_elements = page.query_selector_all('a[href^="/r/"]')
        print(f'Found {len(subreddit_elements)} subreddit elements for user {username}')

        for subreddit_element in subreddit_elements:
            subreddit_url = subreddit_element.get_attribute('href')
            if subreddit_url:
                print(subreddit_url)
                subreddit_name = subreddit_url.split('/')[2]
                user_subreddits.add(subreddit_name)
        
        browser.close()
    
    return list(user_subreddits)

def main():
    subreddit_to_scrape = 'wallstreetbets'
    num_posts_to_scrape = 1

    users = scrape_subreddit(subreddit_to_scrape, num_posts_to_scrape)
    print(users)

    user_subreddit_interactions = {}
    for user in users:
        user_subreddit_interactions[user] = scrape_user_activity(user)


    print(user_subreddit_interactions)


if __name__ == '__main__' :
    main()

    
'''

from playwright.sync_api import sync_playwright
from concurrent.futures import ThreadPoolExecutor, as_completed
import time

def scroll_to_bottom(page):
    page.evaluate('window.scrollTo(0, document.body.scrollHeight)')
    page.wait_for_timeout(2000)  # Wait for comments to load

def scrape_post_comments(page, post_url, max_users=3):
    users = set()
    page.goto(post_url)
    page.wait_for_timeout(3000)  # Wait for the page to load

    last_height = page.evaluate('document.body.scrollHeight')

    
    while len(users) < max_users:
        load_more = page.query_selector('button:has-text("View more comments")')
        if load_more:
            load_more.click()
            page.wait_for_timeout(2000)
        else:
            scroll_to_bottom(page)
            new_height = page.evaluate('document.body.scrollHeight')
            if new_height == last_height:
                break
            last_height = new_height
        
        comments = page.query_selector_all('a[href^="/user/"]')
        print(f'Found {len(comments)} user elements')

        for user_element in comments:
            user_url = user_element.get_attribute('href')
            username = user_url.split('/')[-2]  # Extract username from URL
            if(username == 'wsbapp' or username =='HalseyApp' or username == 'VisualMod'):
                pass
            else:
                users.add(username)

            if len(users) >= max_users:
                print(f'Reached maximum number of users: {max_users}')
                return users
    
    return users

Process:
Go to the page you want to scrape
within the html the the selector
After you find selector do what you will

def scrape_subreddit(subreddit, num_posts=10):
    users = set()

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False, slow_mo=50)
        context = browser.new_context()
        page = context.new_page()
        page.goto(f'https://www.reddit.com/r/{subreddit}/')
        page.wait_for_timeout(2000)

        posts = page.query_selector_all('a[data-post-click-location="comments-button"]')
        post_urls = []

        for post in posts[:num_posts]:
            href = post.get_attribute('href')
            if href and href.startswith('/r/'):
                full_url = f'https://www.reddit.com{href}'
                if f'/r/{subreddit}/' in full_url:
                    post_urls.append(full_url)
        
        if post_urls:
            print("Getting posts")
        else:
            print('No posts')

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

        last_height = page.evaluate('document.body.scrollHeight')
        while True:
            page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
            page.wait_for_timeout(1000)
            new_height = page.evaluate('document.body.scrollHeight')
            if new_height == last_height:
                break
            last_height = new_height

        subreddit_elements = page.query_selector_all('a[href^="/r/"]')
        print(f'Found {len(subreddit_elements)} subreddit elements for user {username}')

        for subreddit_element in subreddit_elements:
            subreddit_url = subreddit_element.get_attribute('href')
            if subreddit_url:
                subreddit_name = subreddit_url.split('/')[2]
                user_subreddits.add(subreddit_name)
        
        browser.close()
    
    return list(user_subreddits)

def main():
    subreddit_to_scrape = 'wallstreetbets'
    num_posts_to_scrape = 1

    users = scrape_subreddit(subreddit_to_scrape, num_posts_to_scrape)
    print(users)

    user_subreddit_interactions = {}

    # Parallelize user profile scraping
    with ThreadPoolExecutor(max_workers=5) as executor:
        futures = {executor.submit(scrape_user_activity, user): user for user in users}
        for future in as_completed(futures):
            user = futures[future]
            try:
                user_subreddit_interactions[user] = future.result()
            except Exception as exc:
                print(f'User {user} generated an exception: {exc}')

    print(user_subreddit_interactions)

if __name__ == "__main__":
    main()
'''