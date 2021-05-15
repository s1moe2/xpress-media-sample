## Media sample

Run locally: `npm start`

Run with docker: `docker-compose up -d`

Test upload with:
```
curl --location --request POST 'http://localhost:5000/avatar' \
--form 'avatar=@"./sample.png"'
```