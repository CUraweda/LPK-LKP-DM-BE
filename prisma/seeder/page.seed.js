import prism from "../../src/config/prisma.db.js";


export async function seedPage() {
    const pageData = await prism.page.createMany({
        data: [
            //? REGISTER DATA
            {
                pageID: "REGISTER",
                uid: "REGISTER_1",
                dividerTitle: "Register",
                title: "Bergabung & Mulai Belajar",
                description: "Daftar sekarang dan kuasai seni dress making dengan bimbingan mentor profesional."
            },
            {
                pageID: "REGISTER",
                uid: "REGISTER_2",
                dividerTitle: "Berhasil Register",
                title: "Pendaftaran Berhasil",
                description: "Terima kasih telah mendaftar! Kami telah menerima formulir Anda. Informasi mengenai seleksi akan dikirim ke email Anda segera."
            },
            {
                pageID: "REGISTER",
                uid: "REGISTER_3",
                dividerTitle: "Image Slide 1",
                file: ""
            },
            {
                pageID: "REGISTER",
                uid: "REGISTER_4",
                dividerTitle: "Image Slide 2",
                file: ""
                
            },
            {
                pageID: "REGISTER",
                uid: "REGISTER_5",
                dividerTitle: "Image Slide 3",
                file: ""
            },
            {
                pageID: "REGISTER",
                uid: "REGISTER_6",
                dividerTitle: "Image Slide 4",
                file: ""
            },
            
            //? LOGIN DATA
            {
                pageID: "LOGIN",
                uid: "LOGIN_1",
                dividerTitle: "Masuk",
                title: "Selamat Datang Kembali",
                description: "Masuk ke akun Anda dan lanjutkan perjalanan menuju kesuksesan di dunia fashion."
            },
            {
                pageID: "LOGIN",
                uid: "LOGIN_2",
                dividerTitle: "Lupa Kata Sandi",
                title: "Lupa Kata Sandi?",
                description: "Jangan khawatir! Masukkan email Anda untuk mengatur ulang kata sandi dan kembali belajar bersama kami."
            },
            {
                pageID: "LOGIN",
                uid: "LOGIN_3",
                dividerTitle: "Atur Ulang Kata Sandi",
                title: "Atur Ulang Kata Sandi",
                description: "Masukkan kata sandi baru Anda dan pastikan mudah diingat namun tetap aman."
            },
            {
                pageID: "LOGIN",
                uid: "LOGIN_4",
                dividerTitle: "Berhasil Atur Ulang Kata Sandi",
                title: "Kata Sandi Berhasil Diperbarui",
                description: "Kata sandi Anda telah berhasil diubah. Silakan masuk dengan kata sandi baru Anda."
            },
            {
                pageID: "LOGIN",
                uid: "LOGIN_5",
                dividerTitle: "Image Slide 1",
                file: ""
            },
            {
                pageID: "LOGIN",
                uid: "LOGIN_6",
                dividerTitle: "Image Slide 2",
                file: ""
                
            },
            {
                pageID: "LOGIN",
                uid: "LOGIN_7",
                dividerTitle: "Image Slide 3",
                file: ""
            },
            {
                pageID: "LOGIN",
                uid: "LOGIN_8",
                dividerTitle: "Image Slide 4",
                file: ""
            },
            
        ], skipDuplicates: true
    })
}