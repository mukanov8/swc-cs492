# swc-cs492
Semantic Word Clouds

**Link to our project:**

## What's this project about?
You’re in the right place if you want to make better word clouds. The science shows that great word clouds are split into groups of similar words, with space in between and unique colors. Making those groups by yourself can be a pain, so we give you a headstart. Computers are super-quick at this kind of thing but far from perfect, so simply drag and drop words between clusters until you’re satisfied. 

## How does it work?
1) Identify keywords with TF-IDF. Using TF-IDF allows us to focus on unusually frequent rare words and ignore frequent but common words. It does this by comparing the prevalence of a word in the text submitted by the user with the logarthmically adjusted prevalence of that word in a reference corpus (Reuters corpus in our case) 
2) Get the word embeddings for each keyword from a pre-trained Glove model. 
3) Do k-means clustering on the word embeddings. K points are randomly selected as cluster centroids. Each word vector is then grouped in the same cluster as its closest centroid. The cluster centroids are then recalculated (averaging all word vectors in a cluster). The word vectors are then re-grouped with the closest centroid. This process repeats a fixed number of times or until the positions of the centroids stop changing.

## How do I set it up for myself?
1) Clone this repo 
2) Download  and unzip the pre-trained word vectors from http://nlp.stanford.edu/data/glove.6B.zip into the back-end subfolder 
4) Run build_idf_csv.py to build a table of reference Inverse Document Frequency (IDF) values
5) Run convert_format.py
6) Run ws.py to get the server going
7) Open index.html
