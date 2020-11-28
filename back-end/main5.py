import math, random, csv, json, sys
from collections import defaultdict

from nltk import FreqDist,word_tokenize,pos_tag
from nltk.corpus import reuters, stopwords
# from nltk.stem.snowball import SnowballStemmer

from gensim.models import KeyedVectors

NUM_OF_KEYWORDS = 150
NUM_OF_CLUSTERS = 6

def preprocess_text(text_string):
    tokens = word_tokenize(text_string)
    # lowercasing and removing punctuation
    tokens = [token.lower() for token in tokens if token.isalpha()]
    # removing extremely common words
    common_words = stopwords.words("english")
    tokens = [token for token in tokens if token not in common_words]
    
    # Enable stemming if desired
    # stemmer = SnowballStemmer("english")
    # tokens = [stemmer.stem(token) for token in tokens]
    return tokens

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

def get_keywords_clusters(keywords):
    word_vecs = KeyedVectors.load('word2vec.wordvectors',mmap='r')
    
    # Removing words not present in the model vocab
    unknown = []
    for i,keyword in enumerate(keywords):
        if keyword not in word_vecs.vocab:
            unknown.append(keyword)
            keywords.pop(i)

    # Very naive clustering algorithm
    # 1) Randomly select a word to initialize each cluster
    # 2) One by one, insert each remaining word in the cluster which has the highest average similarity
    #       between the word and all words currently in the cluster
    seeds = random.sample(keywords,NUM_OF_CLUSTERS)
    clusters = [[seed] for seed in seeds]
    for keyword in keywords:
        if keyword not in seeds:
            similarity_to_clusters = [0]*NUM_OF_CLUSTERS
            for i,cluster in enumerate(clusters):
                sum = 0
                for word in cluster:
                    sum+=word_vecs.similarity(keyword,word)
                similarity_to_clusters[i] = sum / len(cluster)
            index_max = max(range(len(similarity_to_clusters)), key=similarity_to_clusters.__getitem__)
            clusters[index_max].append(keyword)
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
    #text_string = sys.argv[1]
    
    tokens = preprocess_text(text_string)
    
    (keywords,tfidfs) = get_keywords(tokens)
    #[print(keyword,tfidfs[keyword]) for keyword in keywords]

    clusters = get_keywords_clusters(keywords)
    #[print(cluster) for cluster in clusters]
    
    json_string = produce_json(tfidfs,clusters)
    
    return json_string
    
# def main():
#     with open('sample_text.txt','r') as f:
#         text_string = f.read()
#     print(get_json_clusters(text_string))

# if __name__=="__main__":
#     main()