# Thư mục assets

Chứa các tài nguyên tĩnh của website.

## Cấu trúc

```
assets/
├── avatar.jpg        <- Ảnh đại diện (thay vào avatar-frame trong hero)
├── og-image.png      <- Ảnh chia sẻ mạng xã hội (kích thước 1200x630)
├── favicon.ico       <- Favicon riêng (hiện đang dùng SVG inline trong index.html)
└── images/           <- Ảnh cho các dự án, blog, ...
```

## Gợi ý

- Avatar: ảnh vuông khoảng 400x400px trở lên, nén WebP/JPG để tải nhanh.
- og-image: đúng kích thước 1200x630px để Facebook/Zalo hiển thị đẹp.
- Khi thêm `<img>`, nhớ kèm `loading="lazy"` và `width`/`height` để tránh layout shift.
