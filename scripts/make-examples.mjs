import fs from 'node:fs';
import {animations,effects,sceneTypes} from '../src/catalog.mjs';
fs.writeFileSync('catalog/animations.json',JSON.stringify(animations,null,2));
fs.writeFileSync('catalog/effects.json',JSON.stringify(effects,null,2));
for(const a of animations){fs.mkdirSync('catalog/'+a.id,{recursive:true});fs.writeFileSync(`catalog/${a.id}/example.json`,JSON.stringify(a,null,2));}
fs.writeFileSync('examples/catalog.json',JSON.stringify({width:540,height:960,scenes:animations},null,2));
const example=(id,title,source,rows)=>{const data={title,width:540,height:960,fps:30,narrationStatus:'silent-preview; record the supplied Arabic script to produce a narrated version',sources:source,scenes:rows.map(([type,title,items,caption,values],i)=>({type,title,items,caption,values:values||[],duration:5,theme:i%2?'midnight':'studio'}))};fs.writeFileSync(`examples/${id}.json`,JSON.stringify(data,null,2));};
example('next-word','كيف يختار النموذج التكملة؟',['https://research.google/pubs/attention-is-all-you-need/'],[
 ['tokens','النص يصبح وحدات',['نكتب','جملة','قصيرة'],'النموذج يقسّم النص إلى وحدات أصغر. الوحدة ليست دائماً كلمة كاملة.'],
 ['network','السياق يغيّر التوقع',['السياق','الترتيب','المعنى','النمط','التوقع'],'يستخدم السياق ليحسب احتمالات الوحدات التالية.'],
 ['probability','أكثر من تكملة ممكنة',['تكملة أ','تكملة ب','تكملة ج'],'هذه أرقام توضيحية. الاختيار لا يعني دائماً أخذ أعلى احتمال.',[55,30,15]],
 ['flow','تتكرر العملية',['وحدة جديدة','سياق أطول','توقع جديد'],'ثم يضيف الوحدة للنص، ويعيد العملية لبناء الإجابة.']
]);
example('ai-training','كيف يتعلم النموذج؟',['https://developers.google.com/machine-learning/crash-course/linear-regression/gradient-descent'],[
 ['flow','تعلّم من الأمثلة',['بيانات','توقع','مقارنة'],'أثناء التدريب، يبدأ النموذج بتوقع نتيجة من بيانات المثال.'],
 ['comparison','قارن التوقع بالهدف',['التوقع','الهدف'],'دالة الخسارة تقيس الفرق بين النتيجة المتوقعة والهدف.'],
 ['network','عدّل الأوزان',['الخسارة','التدرج','الأوزان','التحديث','جولة جديدة'],'تُستخدم التدرجات لتحديث الأوزان باتجاه تقليل الخسارة.'],
 ['bars','اختبر على بيانات جديدة',['تدريب','تحقق','اختبار'],'تحسن التدريب وحده لا يكفي. نختبر على بيانات لم يتدرب عليها.',[80,70,68]]
]);
example('face-unlock','كيف يتعرف الهاتف على الوجه؟',['https://support.apple.com/en-us/102381'],[
 ['scan','أكثر من صورة',['نقاط','عمق','وجه'],'في أنظمة مثل Face ID، تُستخدم نقاط غير مرئية لقياس عمق الوجه.'],
 ['layers','خريطة وصورة',['خريطة عمق','صورة تحت الحمراء','تمثيل رياضي'],'تتحول بيانات العمق والصورة تحت الحمراء إلى تمثيل رياضي.'],
 ['comparison','مقارنة على الجهاز',['الوجه المسجل','القراءة الجديدة'],'يقارن الجهاز هذا التمثيل بالبيانات المسجلة.'],
 ['hero','نتيجة المطابقة',['قياس','مقارنة','تحقق'],'عند نجاح التحقق، يسمح الجهاز بالدخول. الرسم هنا توضيحي.']
]);
example('solar-power','كيف يصير الضوء كهرباء؟',['https://www.energy.gov/cmei/systems/solar-photovoltaic-cell-basics'],[
 ['solar','من الضوء إلى الشحنة',['ضوء','خلية','تيار'],'تمتص مادة شبه موصلة طاقة من ضوء الشمس.'],
 ['layers','الطاقة تحرّك الشحنات',['ضوء','مادة شبه موصلة','شحنات'],'تساعد هذه الطاقة على توليد شحنات قابلة للحركة داخل الخلية.'],
 ['flow','دائرة مكتملة',['فصل الشحنات','دائرة خارجية','تيار كهربائي'],'تفصل بنية الخلية الشحنات. وفي دائرة مغلقة يتدفق تيار كهربائي.'],
 ['solar','طاقة يمكن استخدامها',['خلية','دائرة','حمل كهربائي'],'هكذا تتحول بعض طاقة الضوء إلى كهرباء، وليس كل الضوء الممتص.']
]);
example('fiber-internet','كيف تنتقل البيانات بالضوء؟',['https://www.corning.com/optical-communications/worldwide/en/home/products/fiber/optical-fiber-basics.html'],[
 ['fiber','البيانات تصبح ضوءاً',['إشارة','نبضات','بيانات'],'يحوّل المرسل البيانات إلى إشارة ضوئية.'],
 ['layers','قلب وغلاف',['قلب زجاجي','غلاف','حماية'],'يساعد اختلاف معامل الانكسار بين القلب والغلاف على توجيه الضوء.'],
 ['fiber','الضوء داخل الليف',['مرسل','ليف','مستقبل'],'الرسم المتعرج تبسيط تعليمي. طريقة الانتشار تعتمد على نوع الليف.'],
 ['flow','المستقبل يقرأ الإشارة',['ضوء','كاشف','بيانات'],'في النهاية يحوّل المستقبل الإشارة الضوئية إلى إشارة كهربائية.']
]);
console.log(`${animations.length} animations, ${effects.length} effects, ${sceneTypes.length} scene types; five original Arabic scripts`);
