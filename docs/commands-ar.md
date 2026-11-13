# الأوامر والملفات

المساعد ينفّذ هذه الخطوات عنك. الأسماء الإنجليزية ثابتة لتسهيل الأوامر، والمحتوى عربي وقابل للتغيير.

| المطلوب | الأمر |
|---|---|
| عرض الكتالوج | `npm run motion -- list` |
| حركة واحدة | `npm run motion -- animate comparison --out work/compare` |
| نص وألوان خاصة | `npm run motion -- animate comparison --config my-config.json --out work/custom` |
| نصف علوي | أضف `--mode top` |
| طبقة شفافة | أضف `--mode overlay` ثم صدّر `.mov` أو `.webm` |
| شرح كامل | `npm run motion -- explain examples/next-word.json --out work/explain` |
| مؤثر على فيديو | `npm run motion -- video-fx checklist --input shot.mp4 --out work/checklist` |
| فحص | `npm run motion -- check work/compare` |
| معاينة | `npm run motion -- preview work/compare` |
| تصدير | `npm run motion -- render work/compare --out renders/compare.mp4` |

`--theme studio` فاتح، `midnight` داكن، `plum` بنفسجي. `--title` يغيّر العنوان. ملف config يغيّر `items` و`values` و`duration`. أمثلة كل حركة في `catalog/<id>/example.json`.

كل مشروع جديد يحتوي `index.html`، ومجلد `compositions` للمشاهد، و`assets` للخطوط والوسائط، و`plan.json` و`timeline.json`. عدّل هذه الملفات أو اطلب من المساعد تعديلها. إعادة البناء ترفض الكتابة فوق مشروع موجود.

## شرح بصوتك

انسخ أحد ملفات `examples/*.json`. اكتب `anchor` لكل مشهد بعد الأول: عبارة موجودة حرفياً في التسجيل. أعطِ المساعد التسجيل؛ بعد التفريغ:

```bash
python3 scripts/sync.py work/words.json 'العبارة المطلوبة'
python3 scripts/align-plan.py my-plan.json work/words.json voice.wav --out aligned-plan.json
npm run motion -- explain aligned-plan.json --out work/voiced
npm run motion -- render work/voiced --out renders/voiced.mp4
```

المحاذاة تنشئ كابشن من ثلاث كلمات تقريباً وتضبط بداية المشاهد على التسجيل. إذا تكررت العبارة، حدّد `occurrence` في المشهد. راجع التفريغ أولاً. الكابشن الموجود في أمثلة المعرض نص تفسيري، وليس تفريغاً لصوت غير موجود.

## الصور والخرائط

الخرائط الافتراضية رسومات توضيحية وليست مسارات ملاحة. يمكن تمرير `points: [[x,y],...]` بإحداثيات الرسم (880×900) و`mapImage` لصورة خريطة محلية مرخصة. لا توجد خدمة جلب مسارات حقيقية بين عنوانين في هذا الإصدار. على المساعد تجهيز البيانات والتحقق منها وذكر مصدر الخريطة قبل وصفها بأنها حقيقية.

`broll-panel` يقبل `--media screen.png` أو `--media recording.mp4`. ضع الشاشات الحقيقية داخل المشروع. لا يحتوي هذا المشروع على حسابات خدمات أو مفاتيح أو لقطات منتجات خاصة.

## مقطع مؤثر من فيديو أطول

استخدم `--start 8.5 --duration 4` لاستخراج أربع ثوانٍ. إذا كان المؤثر يحتاج فصل الشخص، يجب أن يكون `--cutout` لنفس المصدر والتوقيت؛ أو قص المصدر أولاً وافصل هذا المقطع ثم استخدم البداية صفر. صوت المصدر محفوظ إذا كان موجوداً. المعرض وحده يستخدم نسخاً بلا مسار صوت.

لا يتم تركيب المقطع تلقائياً في بقية الفيديو؛ المساعد يدمجه عبر مهارة المونتاج التي تستخدمها ويحافظ على القرارات السابقة. لا يوجد تكبير للوجه ضمن المؤثرات الافتراضية.

## تصدير وجودة

المقاس الافتراضي 1080×1920، والأمثلة الصغيرة في المعرض 540×960 لتسريع تحميلها. تستطيع بناء المشروع بعرض وارتفاع مختلفين متوافقين عبر `--width` و`--height` أو الخطة. زيادة دقة فيديو مصدر صغير لا تضيف تفاصيل مفقودة.

MOV يستخدم ProRes 4444 للشفافية. MP4 فيديو عادي بلا alpha. افحص الخلفية الشفافة فوق خلفية ملونة للتأكد منها.
