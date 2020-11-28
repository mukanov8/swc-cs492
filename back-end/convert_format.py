from gensim.scripts.glove2word2vec import glove2word2vec
from gensim.models import KeyedVectors
import time

# Download the glove model into same folder as this python file
# Ensure the name matches the name of the input file below

# Converts the glove model format to a word2vec model format
glove_input_file = './glove.6B/glove.6B.100d.txt'
word2vec_output_file = './glove.6B/glove.6B.100d.txt.word2vec'

t0 = time.time()

glove2word2vec(glove_input_file, word2vec_output_file)
t1 = time.time()
print("Conversion time ",t1-t0)

model = KeyedVectors.load_word2vec_format(word2vec_output_file, binary=False)
t2 = time.time()
print("Loading time ",t2-t1)

model.save("word2vec.wordvectors")
t3 = time.time()
print("Saving as numpy for faster reloads later",t3-t2)