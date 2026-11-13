# ابدأ من هنا

تحتاج Claude Code أو Codex على جهازك، وNode.js 22 أو أحدث، وFFmpeg. اشتراك المساعد ليس ضمن الملفات. التوليد والرندر محليان؛ لا تحتاج اشتراك HyperFrames مدفوعاً للرندر المحلي.

1. من GitHub اضغط **Code → Download ZIP** وفك الضغط، أو استخدم Git.
2. ضع المجلد في مكان ثابت وافتحه في Claude Code أو Codex.
3. قل للمساعد: «اقرأ README وثبّت الأدوات اللازمة لهذا المشروع، ثم جهّز أول تجربة».

المساعد يشغّل داخل المجلد:

```bash
npm install
npm run setup
npm run setup -- --check
```

أعد فتح جلسة المساعد لتظهر المهارات: `animate` و`explain` و`video-fx`. إن كان اسم مهارة موجوداً، الإعداد يحافظ عليها؛ يمكنك طلب قراءة المهارة مباشرة من مجلد هذا المشروع.

## أول تجربة

قل:

> استخدم animate لعمل مقارنة عربية بين العمل اليدوي والعمل مع مساعد. لا تخترع أرقاماً. أريد فيديو عمودي وملفات قابلة للتعديل.

أو شغّل المثال الجاهز:

```bash
npm run motion -- animate comparison --out work/first-animation
npm run motion -- check work/first-animation
npm run motion -- preview work/first-animation
npm run motion -- render work/first-animation --out renders/first-animation.mp4
```

المعاينة تفتح رابطاً محلياً يطبعه الأمر. المساعد يستطيع تعديل النصوص والحركة في ملفات المشروع أو في واجهة HyperFrames. هذا ليس محرر Reel Studio؛ يمكن استخدام الاثنين معاً.

## الصوت والتوقيت

للتفريغ المحلي بالعربية تحتاج Python 3.12 (أو 3.10–3.13) وأداة Whisper الاختيارية:

```bash
npm run setup -- --speech --python python3.12
.venv/bin/python scripts/transcribe.py recording.mp4 --out work/words.json
```

على Windows استخدم `.venv/Scripts/python.exe` بدلاً من `.venv/bin/python`. أول تفريغ يحمّل نموذج Whisper small؛ يمكن اختيار نموذج آخر عبر `--model`. راجع الكلمات العربية والتوقيت قبل الاعتماد عليهما. يمكنك استخدام تفريغ موجود بدلاً من تثبيت هذه الأداة.

لا يوجد صوت اصطناعي مفروض عليك. سجّل النص بصوتك، أو اطلب من مساعدك خدمة صوت متاحة عندك. الأمثلة الخمسة في المعرض صامتة.

## المؤثرات خلف الشخص

```bash
npm run motion -- cutout my-shot.mp4 --out work/my-subject.mov
npm run motion -- video-fx echo --input my-shot.mp4 --cutout work/my-subject.mov --title 'الفكرة' --out work/my-effect
```

أول استخدام يحمّل نموذج فصل الخلفية المحلي الخاص بـHyperFrames (حوالي 170 MB). لا ترفع الأداة الفيديو لخدمة خارجية. النتيجة تعتمد على الإضاءة والحركة؛ افحص الشعر والنظارة واليدين. اختر مقطعاً قصيراً للتجربة.

## إذا ظهرت مشكلة

- **ffmpeg غير موجود:** على Mac ثبّت `ffmpeg-full` عبر Homebrew؛ وعلى Windows/Linux ثبّت FFmpeg وأضفه إلى PATH.
- **Chrome غير موجود:** شغّل `npm run hf -- doctor` واتبع تشخيص متصفح الرندر.
- **المهارة لا تظهر:** أعد فتح جلسة المساعد، أو قل له يقرأ `skills/animate/SKILL.md` مباشرة. لا تنقل المجلد بعد تثبيت الروابط.
- **اسم مجلد الإخراج موجود:** استخدم اسماً جديداً لحفظ التعديل السابق.
- **العربية غير واضحة:** لا تستبدل الخط المرفق بخط لا يدعم العربية. افحص RTL والأرقام الإنجليزية.
- **إضافة HyperFrames مثبتة عندك:** استخدم مشغّل الإضافة المثبتة، ولا تحدّثها من داخل هذا المشروع. يمكن للمساعد ضبط `HYPERFRAMES_PLUGIN_CLI` إلى مسار المشغّل.

الاختبار الفعلي لهذا الإصدار على Apple Silicon Mac. إعداد Windows وLinux موجود لكن لم يُختبر على جهاز فعلي في هذا الإصدار.
