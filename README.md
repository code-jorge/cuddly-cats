## Cuddly cats

Generates cuddly cats using AI.

[![Netlify Status](https://api.netlify.com/api/v1/badges/3b05af0c-eca8-4ae6-a7e9-dab32f4d61a8/deploy-status)](https://app.netlify.com/sites/cuddly-cats/deploys)

### How it works

- It randomly picks 2 words from a list each day (using a random seed).
- It uses the OpenAI API to generate the image of a cat based on the 2 words.
- If the user likes it, it can be saved to an S3 bucket.
- All the saved images can be viewed in a gallery.

### Routes

- `/` - Home page, where you can generate a cat
- `/album` - Album page, where you can view all the saved images


### Environment vars required

| Env var name                  | Description           |
|-------------------------------|-----------------------|
| PROJECT_OPENAI_API_KEY        | OpenAI API key        |
| PROJECT_AWS_ACCESS_KEY_ID     | AWS access key ID     |
| PROJECT_AWS_SECRET_ACCESS_KEY | AWS secret access key |
| PROJECT_AWS_REGION            | AWS region            |
| PROJECT_S3_BUCKET_NAME        | S3 bucket name        |