import sys
target_profile = sys.argv[1]
from instaloader import Instaloader, Profile, exceptions
loader = Instaloader()

try:
    profile = Profile.from_username(loader.context, target_profile)
except exceptions.ProfileNotExistsException:
    print("This account does not exist")
    exit()

num_followers = profile.followers
total_num_likes = 0
total_num_comments = 0
total_num_posts = 0

counter = 0
poststocount = 10

for post in profile.get_posts():
    if(counter >= poststocount):
        break
    total_num_likes += post.likes
    total_num_comments += post.comments
    total_num_posts += 1
    counter=counter+1

if(total_num_posts == 0):
    print("No posts")
else:
    engagement = float(total_num_likes + total_num_comments) / (num_followers * total_num_posts)
    fe = [num_followers,engagement]
    print(fe)