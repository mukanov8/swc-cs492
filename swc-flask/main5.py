import math, csv, json
from collections import defaultdict

from nltk import FreqDist,word_tokenize
from nltk.corpus import reuters, stopwords
# from nltk.stem.snowball import SnowballStemmer
import nltk
nltk.download('punkt')
nltk.download('reuters')
nltk.download('stopwords')


from gensim.models import KeyedVectors
from sklearn import cluster

NUM_OF_KEYWORDS = 150


def preprocess_text(text_string):
    tokens = word_tokenize(text_string)
    num_of_clusters = int(tokens[0].split(':')[0])

    # lowercasing and removing punctuation
    tokens = [token.lower() for token in tokens if token.isalpha()]
    # removing extremely common words
    common_words = stopwords.words("english")
    tokens = [token for token in tokens if token not in common_words]
    
    # Enable stemming if desired
    # stemmer = SnowballStemmer("english")
    # tokens = [stemmer.stem(token) for token in tokens]
    return (tokens,num_of_clusters)

def read_idf_values():
    N = len(reuters.fileids())
    idf_values = defaultdict(lambda: math.log(N))
    with open('idf_reuters.csv', 'r') as file:
        reader = csv.reader(file)
        for row in reader:
            idf_values[row[0]] = float(row[1])
    return idf_values

def calculate_tfidf(idf,tokens):
    fd = FreqDist(tokens)
    tfidf = dict() 
    for token in tokens:
        tf = fd[token]/len(tokens)
        tfidf[token] = tf*idf[token]
    return tfidf

def get_top_tfidf_words(tfidf,n):
    words = []
    for word in sorted(tfidf, key = tfidf.get, reverse = True):
        words.append(word)
        
        # can filter to consider only nouns
        # problem is that it will miss named entities e.g. 'america' or 'obama'
        # if pos_tag(word)[0][1].startswith('NN'):
        #     words.append(word)

    return words[:n]

def get_keywords(tokens):
    idf_values = read_idf_values()
    tfidfs = calculate_tfidf(idf_values,tokens)
    keywords = get_top_tfidf_words(tfidfs,NUM_OF_KEYWORDS)
    return keywords,tfidfs

def get_keywords_clusters(keywords,num_of_clusters):
    word_vecs = KeyedVectors.load('word2vec.wordvectors',mmap='r')
    
    # Removing words not present in the model vocab
    unknown = []
    for i,keyword in enumerate(keywords):
        if keyword not in word_vecs.vocab:
            unknown.append(keyword)
            keywords.pop(i)

    keyword_vecs = [word_vecs[keyword] for keyword in keywords]

    kmeans = cluster.KMeans(n_clusters = num_of_clusters,init = 'random', n_init = 50)
    kmeans.fit(keyword_vecs)
    labels = kmeans.labels_
    clusters = [[] for i in range(num_of_clusters)]
    for i,keyword in enumerate(keywords):
        clusters[labels[i]].append(keyword)
    return clusters

def produce_json(tfidfs,clusters):
    d = dict()
    for cluster_num,cluster in enumerate(clusters):        
        d[cluster_num] = []
        for keyword in cluster:
            entry = {"x": keyword, "value": int(tfidfs[keyword]*1000)}
            d[cluster_num].append(entry)
    return json.dumps(d)

def get_json_clusters(text_string):

    (tokens,num_of_clusters) = preprocess_text(text_string)
    
    (keywords,tfidfs) = get_keywords(tokens)
    #[print(keyword,tfidfs[keyword]) for keyword in keywords]

    clusters = get_keywords_clusters(keywords,num_of_clusters)
    #[print(cluster) for cluster in clusters]
    
    json_string = produce_json(tfidfs,clusters)
    
    return json_string
    
# def main():
#     with open('sample_text.txt','r') as f:
#         text_string = f.read()
#     print(get_json_clusters(text_string))

# if __name__=="__main__":
#     main()