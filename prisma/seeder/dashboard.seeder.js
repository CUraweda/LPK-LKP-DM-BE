import prism from "../../src/config/prisma.db.js";


export async function seedDashboard() {
    const dashboardData = await prism.dashboard.createMany({
        data: [
            //? HERO BANNER
            {
                sectionID: "HERO_BANNER",
                sectionName: "Hero Banner",
                uid: "HERO_BANNER_1",
                image: "",
                title: "Kuasai Seni Dress Making Bersama Kami!",
                description: "Tingkatkan keterampilan Anda dan wujudkan impian menjadi desainer profesional"
            },
            {
                sectionID: "HERO_BANNER",
                sectionName: "Hero Banner",
                uid: "HERO_BANNER_2",
                image: "",
                title: "Jahit Impian, Ciptakan Karya!",
                description: "Ikuti pelatihan dress making dari dasar hingga mahir dan jadilah bagian dari industri fashion profesional."
            },
            {
                sectionID: "HERO_BANNER",
                sectionName: "Hero Banner",
                uid: "HERO_BANNER_3",
                image: "",
                title: "Dari Sketsa ke Busana, Mulai Perjalananmu di Dunia Fashion!",
                description: "Pelajari teknik menjahit, pola, dan desain untuk menciptakan karya busana berkualitas tinggi."
            },
            {
                sectionID: "HERO_BANNER",
                sectionName: "Hero Banner",
                uid: "HERO_BANNER_4",
                image: "",
                title: "Pelajari Dress Making & Wujudkan Brand Fashionmu!",
                description: "Kuasai keterampilan menjahit dan desain untuk membangun bisnis fashion impianmu."
            },
            
            //? TENTANG Kam
            {
                sectionID: "TENTANG_KAMI",
                sectionName: "Tentang Kami",
                uid: "TENTANG_KAMI_1",
                title: "Mengapa Memilik Kami?",
                description: "Dress Making adalah lembaga pelatihan terpercaya yang berfokus pada pengembangan keterampilan dress making. Dengan metode pembelajaran yang interaktif dan praktis, kami membantu Anda menguasai teknik terbaru dalam pembuatan busana."
            },
            
            //? VISI
            {
                sectionID: "VISI",
                sectionName: "Visi",
                uid: "VISI_1",
                title: "Visi Kami",
                description: "Menjadi lembaga pelatihan kerja terkemuka dalam bidang dress making yang mencetak tenaga profesional dan kreatif di industri fashion."
            },
            
            //? MISI
            {
                sectionID: "MISI",
                sectionName: "Misi",
                uid: "MISI_1",
                is_title: true,
                image: "",
                title: "Misi Kami",
            },
            {
                sectionID: "MISI",
                sectionName: "Misi",
                uid: "MISI_2",
                title: "Meningkatkan Keterampilan",
                description: "Membantu peserta menguasai teknik menjahit, desain, dan pola secara profesional."
            },
            {
                sectionID: "MISI",
                sectionName: "Misi",
                uid: "MISI_3",
                title: "Memberikan Pelatihan Berkualitas",
                description: "Menyediakan program pelatihan berbasis praktik dengan kurikulum yang selalu diperbarui."
            },
            {
                sectionID: "MISI",
                sectionName: "Misi",
                uid: "MISI_4",
                title: "Membuka Peluang Karir",
                description: "Mempersiapkan lulusan untuk berkarir di industri fashion atau membuka usaha sendiri."
            },
            {
                sectionID: "MISI",
                sectionName: "Misi",
                uid: "MISI_5",
                title: "Mendorong Kreativitas & Inovasi",
                description: "Menanamkan jiwa kreatif dalam menciptakan desain busana yang unik dan bernilai jual."
            },
            {
                sectionID: "MISI",
                sectionName: "Misi",
                uid: "MISI_6",
                title: "Menjalin Kemitraan",
                description: "Bekerja sama dengan industri fashion dan perusahaan untuk meningkatkan kesempatan kerja bagi lulusan."
            },
            
            //?KEPERCAYAAN & PRESTASI KAMI 
            {
                sectionID: "KEPERCAYAAN_PRESTASI",
                sectionName: "Kepercayaan & Prestasi",
                uid: "KEPERCAYAAN_PRESTASI_1",
                title: "Kepercayaan & Prestasi Kami",
                description: "Kami berkomitmen untuk memberikan pelatihan berkualitas dan dukungan profesional, mencetak talenta terbaik di industri fashion dan menjahit.",
                siswa_counter: "300+",
                industri_counter: "25+",
                alumni_counter: "500+"
            },
            
            //? PROGRAM PELATIHAN
            {
                sectionID: "PROGRAM_PELATIHAN",
                sectionName: "Program Pelatihan",
                uid: "PROGRAM_PELATIHAN_1",
                is_title: true, 
                title: "Program Pelatihan Kami",
                description: "Pelatihan komprehensif untuk menguasai teknik menjahit, desain, dan fashion profesional.",
            },
            {
                sectionID: "PROGRAM_PELATIHAN",
                sectionName: "Program Pelatihan",
                uid: "PROGRAM_PELATIHAN_2",
                training_id: null,
            },
            {
                sectionID: "PROGRAM_PELATIHAN",
                sectionName: "Program Pelatihan",
                uid: "PROGRAM_PELATIHAN_2",
                training_id: null,
            },
            
            //? TIM
            {
                sectionID: "TIM",
                sectionName: "Tim",
                uid: "TIM_1",
                is_title: true,
                title: "Kenali Tim Kami",
                description: "Tim ahli berpengalaman di bidang jahit, desain, dan fashion profesional, siap membimbing Anda menuju kesuksesan."
            },
            {
                sectionID: "TIM",
                sectionName: "Tim",
                uid: "TIM_2",
                image: "",
                title: "Nama Lengkap",
                description: "Posisi"
            },
            
            //? Karya Siswa
            {
                sectionID: "KARYA_SISWA",
                sectionName: "Karya Siswa",
                uid: "KARYA_SISWA_1",
                is_title: true,
                title: "Karya Siswa Kami", 
                description: "Lihat hasil karya kreatif yang dihasilkan oleh para peserta pelatihan kami."
            },
            {
                sectionID: "KARYA_SISWA",
                sectionName: "Karya Siswa",
                uid: "KARYA_SISWA_2",
                image: ""
            },
            
            //? TESTIMONI
            {
                sectionID: "TESTIMONI",
                sectionName: "Testimoni",
                uid: "TESTIMONI_1",
                is_title: true,
                title: "Apa Kata Alumni", 
                description: "Pengalaman belajar yang interaktif, bermanfaat, dan membuka peluang karier di dunia fashion!"
            },
            {
                sectionID: "TESTIMONI",
                sectionName: "Testimoni",
                uid: "TESTIMONI_2",
                image: "",
                title: "Aulia", 
                description: "Pemilik Brand Fashion Lokal",
                add_string_1: "Belajar di LPK Dress Making 97 benar-benar mengubah hidup saya! Dari nol, kini saya bisa membuat koleksi busana sendiri dan memulai bisnis fashion."
            },
            
            //? INDUSTRI
            {
                sectionID: "INDUSTRI",
                sectionName: "Industri",
                uid: "INDUSTRI_1",
                is_title: true,
                title: "Industri yang Bekerja Sama", 
                description: "Kami menjalin kemitraan dengan berbagai industri terkemuka untuk memastikan lulusan kami siap bersaing dan memenuhi standar profesional di dunia fashion dan jahit."
            },
            {
                sectionID: "INDUSTRI",
                sectionName: "Industri",
                uid: "INDUSTRI_2",
                image: ""
            },
            
            //? FAQ
            {
                sectionID: "FAQ",
                sectionName: "Faq",
                uid: "FAQ_1",
                is_title: true,
                image: "",
                title: "Pertanyaan yang Sering Diajukan", 
            },
            {
                sectionID: "FAQ",
                sectionName: "Faq",
                uid: "FAQ_2",
                title: "Berapa lama durasi pelatihan?",
                description: "Durasi pelatihan bervariasi tergantung program yang dipilih. Untuk kelas dasar, pelatihan berlangsung sekitar 3 bulan, sedangkan kelas lanjutan bisa mencapai 6 bulan. Kami juga menyediakan program intensif bagi yang ingin belajar lebih cepat." 
            },
            
            //?Footer
            {
                sectionID: "FOOTER",
                sectionName: "Footer",
                uid: "FOOTER_1",
                title: "Setiap Jahitan Mewujudkan Impian, Setiap Karya Menceritakan Perjalanan.", 
            },
            {
                sectionID: "FOOTER",
                sectionName: "Footer",
                uid: "FOOTER_2",
                title: "help@dresmasking.com"
            },
            {
                sectionID: "FOOTER",
                sectionName: "Footer",
                uid: "FOOTER_3",
                title: "0852 3455 9844"
            },
        ], skipDuplicates: true
    })
}