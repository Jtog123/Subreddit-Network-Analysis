'''
Playwright setup
Have it navigate to wallstreet bets
navigate to the top posts of the day
scrape the top 3 posts for 
'''

from playwright.sync_api import sync_playwright, Playwright
import time
import matplotlib
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import networkx as nx
import os

matplotlib.use('Agg')


exclusion_list = ['wsbapp','HalseyApp','VisualMod', 'usaa_auto', 'usaa_renters', 'usaa_homeowners' ,'Colgate_US','ChubbiesShorts']

def ensure_directory_exists(directory):
    if not os.path.exists(directory):
        os.makedirs(directory)

def scroll_to_bottom(page):
    page.evaluate('window.scrollTo(0, document.body.scrollHeight)')
    page.wait_for_timeout(2000)  # Wait for comments to load

def scrape_post_comments(page, post_url, max_users):
    users = set()
    page.goto(post_url)
    page.wait_for_timeout(3000) #Wait for the page to load

    #Has page loaded comments?
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
            if(username in exclusion_list):
                pass
            else:
                users.add(username)

            if len(users) >= max_users:
                print(f'Reached maximum number of users: {max_users}')
                return users
        
    page.close()

    return users        



def scrape_subreddit(subreddit, num_posts, sample_size):
    users = set()

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False, slow_mo=50)
        #Creates a new browser context. It won't share cookies/cache with other browser contexts.
        context = browser.new_context()
        page = context.new_page()
        page.goto(f'https://www.reddit.com/r/{subreddit}/')
        page.wait_for_timeout(2000)

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
            post_users = scrape_post_comments(page, post_url, sample_size)
            users.update(post_users)
        
        page.close()
        context.close()
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
        
        page.close()
        context.close() #close background processes?
        browser.close()
    
    return list(user_subreddits)

def plot_bar_graph(crossover_analysis, file_path):
    subreddits = list(crossover_analysis.keys())
    frequencies = list(crossover_analysis.values())

    plt.figure(figsize=(10, 6))
    plt.bar(subreddits, frequencies, color='skyblue')
    plt.xlabel('Subreddits')
    plt.ylabel('Frequency of interaction')
    plt.title('Frequency of User Interactions Across Subreddits')
    plt.xticks(rotation=90)
    plt.savefig(file_path)
    plt.close()

def plot_heatmap(user_subreddit_interactions, file_path):
    subreddits = set([sub for subs in user_subreddit_interactions.values() for sub in subs])

    subreddit_list = list(subreddits)
    matrix = pd.DataFrame(0, index = subreddit_list, columns = subreddit_list)

    for subs in user_subreddit_interactions.values():
        for i in range(len(subs)):
            for j in range(i + 1, len(subs)):
                matrix.loc[subs[i], subs[j]] += 1
                matrix.loc[subs[j], subs[i]] += 1
    
    plt.figure(figsize=(12, 8))
    sns.heatmap(matrix, cmap='YlGnBu')
    plt.title('Heatmap of Subreddit Interactions')
    plt.savefig(file_path)
    plt.close()


def plot_network_graph(user_subreddit_interactions, file_path):
    G = nx.Graph()

    # Add nodes and edges
    for user, subreddits in user_subreddit_interactions.items():
        for i in range(len(subreddits)):
            for j in range(i + 1, len(subreddits)):
                if G.has_edge(subreddits[i], subreddits[j]):
                    G[subreddits[i]][subreddits[j]]['weight'] += 1
                else:
                    G.add_edge(subreddits[i], subreddits[j], weight=1)

    pos = nx.spring_layout(G, k=0.15, iterations=20)
    plt.figure(figsize=(12, 12))
    nx.draw_networkx_nodes(G, pos, node_size=500, node_color='skyblue')
    nx.draw_networkx_edges(G, pos, width=1.0, alpha=0.5)
    nx.draw_networkx_labels(G, pos, font_size=10)
    plt.title('Network Graph of Subreddit Interactions')
    plt.savefig(file_path)
    plt.close()





#main would take in subreddit, sample_size passed from server
def main(subreddit, sample_size):
    subreddit_to_scrape = subreddit
    #'wallstreetbets'
    num_posts_to_scrape = 1
    #1

    users = scrape_subreddit(subreddit_to_scrape, num_posts_to_scrape, sample_size)
    print(users)

    user_subreddit_interactions = {}
    for user in users:
        user_subreddit_interactions[user] = scrape_user_activity(user)


    print(user_subreddit_interactions)

    crossover_analysis = {}
    for user, subreddits in user_subreddit_interactions.items():
        for subreddit in subreddits:
            if subreddit not in crossover_analysis:
                crossover_analysis[subreddit] = 0
            crossover_analysis[subreddit] += 1
    
    print(crossover_analysis)

    print('/n')

    base_dir = os.path.dirname(os.path.abspath(__file__))
    #print("my base dir is:   ",base_dir)

    static_folder = os.path.join(base_dir, 'static')
    print('with static folder', static_folder)

    base_url = 'http://localhost:5000/static/'

    # Construct paths to the files in the 'static' folder
    bar_graph_path = os.path.join(static_folder, 'bar_graph.png')
    print('My bar graph path is', bar_graph_path)
    heatmap_path = os.path.join(static_folder, 'heatmap.png')
    network_graph_path = os.path.join(static_folder, 'network_graph.png')

    #bar_graph_path = os.path.join('static', 'bar_graph.png')
    #heatmap_path = os.path.join('static', 'heatmap.png')
    #network_graph_path = os.path.join('static', 'network_graph.png')

    plot_bar_graph(crossover_analysis, bar_graph_path)
    plot_heatmap(user_subreddit_interactions, heatmap_path)
    plot_network_graph(user_subreddit_interactions, network_graph_path)

    # Adding a timestamp to avoid browser caching
    
    #return {
    #    'bar_graph': f'{bar_graph_path}',
    #    'heatmap': f'{heatmap_path}',
    #    'network_graph': f'{network_graph_path}'
    #}

    return {
    'bar_graph': f'http://localhost:5000/static/bar_graph.png',
    'heatmap': f'http://localhost:5000/static/heatmap.png',
    'network_graph': f'http://localhost:5000/static/network_graph.png'
    }



if __name__ == '__main__' :
    main()


