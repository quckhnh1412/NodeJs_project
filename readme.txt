# NodeJS_N41

## Link demo : https://youtu.be/rNNJLFy32Po

Trước tiên để chạy được code cần cài đặt các thư viện cần thiết trong terminal:

npm install bcrypt body-parser dotenv ejs express express-flash express-handlebars express-session handlebars mongoose multer nodemailer path pdfkit

Để có thể kết nối được với database vào file app.js thay đổi :
mongoose.connect("mongodb://127.0.0.1:27017/final"); với địa chỉ của mongoose db thích hợp

để chạy được vào terminal và gọi lệnh : node app.js

để có thể truy cập vào hệ thống với tài khoản hãy mở folder database : thêm các file final.products.json, final.user.json, final.categories.json

thêm vào mongoose db
để có thể có được dữ liệu truy cập vào hệ thống
