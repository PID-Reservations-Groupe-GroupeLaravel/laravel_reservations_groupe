# Translation System - Quick Reference Guide

## 🚀 What Changed?

**Reviews are now automatically translated when created!**

When a user posts a review comment, the system automatically translates it to French, English, and Dutch, regardless of which language they wrote it in.

## 📋 API Changes

### Creating a Review (POST /shows/{id}/reviews)

**Before** ❌
```json
{
    "user_id": 5,
    "show_id": 10,
    "score": 5,
    "comment": "C'est un spectacle fantastique!"
}
```
→ Only stored in `comment` column

**After** ✅
```json
{
    "user_id": 5,
    "show_id": 10,
    "score": 5,
    "comment": "C'est un spectacle fantastique!"
}
```
→ Automatically stores in:
- `comment` - Original text
- `comment_fr` - French version
- `comment_en` - English version  
- `comment_nl` - Dutch version
- `translated_by` - 'deepl' (or provider name)
- `source_language` - Detected language

## 🌍 Automatic Language Detection

The system **automatically detects** the language of the comment:

- User writes in **French** → Translates to EN, NL
- User writes in **English** → Translates to FR, NL
- User writes in **Dutch** → Translates to FR, EN
- System can't detect? → Assumes French (default)

**No user input needed!** Just works automatically.

## 📱 Getting Translated Reviews

### 1. Get Original Review
```
GET /api/shows/{id}/reviews
```
Returns reviews with original `comment` text

### 2. Get Specific Language Translation
```
GET /api/reviews/{id}/translate?lang=en
```
Returns the translated comment for that specific language

**Supported languages**: `fr`, `en`, `nl`

## 🔧 Database Schema

The `reviews` table now has:

```sql
-- Original comment
comment TEXT

-- Translations (NEW)
comment_fr TEXT   -- French
comment_en TEXT   -- English
comment_nl TEXT   -- Dutch

-- Metadata (NEW)
translated_by VARCHAR(50)   -- Provider used ('deepl', 'google', etc)
source_language VARCHAR(2)  -- Detected language ('fr', 'en', 'nl')
```

## 🎯 How It Works

```
User posts review comment
        ↓
System auto-detects language
        ↓
DeepL translates to other languages
        (Google Cloud as backup if DeepL fails)
        ↓
All versions saved to database
        ↓
Results cached 24 hours
```

## 💡 Use Cases

### Frontend Display
```javascript
// Show review in user's preferred language
const review = await fetch(`/api/reviews/${id}/translate?lang=${userLanguage}`);
const { translated_comment } = await review.json();
display(translated_comment);
```

### Admin Interface
```sql
-- See all versions of a review
SELECT comment, comment_fr, comment_en, comment_nl 
FROM reviews 
WHERE id = 123;
```

### Statistics
```sql
-- Count reviews by detected language
SELECT source_language, COUNT(*) as total
FROM reviews
GROUP BY source_language;
```

## ⚙️ Testing

### Quick Test
```bash
php artisan test:translation "Bonjour, ceci est un test!"
```

### Expected Output
```
Provider Status:
  • DeepL: ✓ Available
  • Google Cloud Translate: ✓ Available

Detected Language: fr

[fr] Bonjour, ceci est un test!
[en] Hello, this is a test!
[nl] Hallo, dit is een test!

✓ All translations completed successfully!
```

## 🚨 If Translation Fails

The system **automatically falls back**:

1. **DeepL fails?** → Tries Google Cloud
2. **Both fail?** → Uses original text for all languages

**No errors!** The review is still created and saved.

## 📊 Performance

| Action | Time | Source |
|--------|------|--------|
| First Translation | 500ms - 2s | API Call |
| Cached Translation | <10ms | Redis |
| Fallback Attempt | 1-2s | Automatic |

## 🔐 Configuration

All API keys are in `.env`:

```env
# DeepL (Primary) - ✅ Already configured
DEEPL_API_KEY=4d7f...

# Google Cloud (Fallback) - ⚠️ Optional
GOOGLE_TRANSLATION_API_KEY=

# Cache
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
```

## 📈 Limits

**DeepL Free Tier:**
- 500,000 characters per month
- ~16,666 characters per day
- Most reviews are <1000 chars

**System tracks usage** automatically via cache

## 🎓 Examples

### Example 1: French Comment
```json
Request:
POST /api/shows/10/reviews
{
    "score": 5,
    "comment": "C'est absolument merveilleux!"
}

Response Database:
comment:        "C'est absolument merveilleux!"
comment_fr:     "C'est absolument merveilleux!"
comment_en:     "It's absolutely wonderful!"
comment_nl:     "Het is absoluut prachtig!"
source_language: "fr"
```

### Example 2: English Comment
```json
Request:
POST /api/shows/5/reviews
{
    "score": 4,
    "comment": "Great performance, loved it!"
}

Response Database:
comment:        "Great performance, loved it!"
comment_fr:     "Excellente performance, j'ai adoré!"
comment_en:     "Great performance, loved it!"
comment_nl:     "Geweldige voorstelling, ik vond het geweldig!"
source_language: "en"
```

## ❓ FAQ

**Q: Do users need to select a language?**  
A: No! Language is automatically detected.

**Q: What if a comment is in mixed languages?**  
A: The system detects the dominant language. If it can't decide, it defaults to French.

**Q: Are translations cached?**  
A: Yes! 24-hour cache in Redis. Same text = instant retrieval.

**Q: What if DeepL is down?**  
A: Automatic fallback to Google Cloud Translate.

**Q: What if both services are down?**  
A: Original text is used for all language versions. Review is still created.

**Q: Can I manually specify the source language?**  
A: Currently auto-detected. Future enhancement: Add optional `source_language` parameter.

## 📞 Support

### Check System Status
```bash
php artisan test:translation
```

### View Logs
```bash
tail -f storage/logs/laravel.log
```

### Check Redis Connection
```bash
redis-cli ping
# Should return: PONG
```

### Check Specific Review
```bash
php artisan tinker
> Review::find(123)->toArray()
```

## 🔄 Migration

The translation system was added **non-destructively**:
- Old reviews' `comment` column unchanged
- New columns are `nullable`
- Zero downtime deployment

**Backward compatible** ✅

## 📦 What's Included

✅ Automatic translation on review creation  
✅ FR/EN/NL support  
✅ DeepL + Google Cloud fallback  
✅ Redis caching (24h)  
✅ Database persistence  
✅ Language auto-detection  
✅ Error handling & logging  
✅ Test command  
✅ Existing API untouched  

---

**Start Using:**
1. Create a review
2. Translations happen automatically
3. Retrieve with `GET /reviews/{id}/translate?lang=en`

**That's it!** 🎉
