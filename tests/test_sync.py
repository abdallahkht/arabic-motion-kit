import sys,unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'scripts'))
from sync import matches,normalize
class TimingTests(unittest.TestCase):
 def test_arabic_variants(self):
  words=[{'word':'إلى','start':1,'end':1.3},{'word':'الفِكْرة،','start':1.3,'end':1.8},{'word':'الفكرة','start':3,'end':3.5}]
  self.assertEqual(matches(words,'الى الفكرة')[0]['start'],1)
  self.assertEqual(len(matches(words,'الفكرة')),2)
  self.assertEqual(matches(words,'غير موجود'),[])
if __name__=='__main__':unittest.main()
