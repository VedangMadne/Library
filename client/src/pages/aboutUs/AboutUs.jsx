import React from "react";
import image from "../../assets/schoolBuilding.jpg";
import image1 from "../../assets/logo.jpg";
import Hero from "../../components/pages/hero/Hero";

function AboutUs() {
  return (
    <div className="bg text__color">
      <img src={image} style={{ width: "100%", padding:"45px", height:"550px", objectFit: "cover", borderRadius: "50px", marginTop: "30px"}}>
      </img>
      <Hero
        title="Introduction"
        text={
          <>
            Sharda English School, located in Kaij, is a premier educational
            institution dedicated to academic excellence and all-round
            development of students. The school fosters a nurturing environment
            that encourages learning, discipline, and creativity. With a strong
            foundation in values and a commitment to quality education, the
            school empowers students to achieve their highest potential in both
            academic and co-curricular pursuits.
            <br />
            <br />
            The library at Sharda English School, Kaij, is a vibrant hub of
            knowledge and learning. It serves as a welcoming space where
            students can study, explore ideas, and access a wide array of
            educational resources. Stocked with a rich collection of printed
            books, journals, and digital materials, the library supports
            academic research and intellectual growth. It is designed to foster
            a love for reading, encourage independent learning, and enhance the
            overall educational experience of students and teachers alike.
          </>
        }
        image={image1}
        reverse={true}
      />

      <Hero
        title="Mission"
        text={
          <>
            The Sharda English School Library is dedicated to supporting the
            educational vision of the institution by nurturing a culture of
            reading, critical thinking, and lifelong learning. Its mission is to
            empower students and faculty with the knowledge, tools, and
            resources necessary to thrive in an information-driven world.
            Through access to a wide array of curated print and digital
            collections, the library plays a central role in enhancing academic
            achievement and personal growth.
            <br />
            <br />
            Open to all students and staff during school hours, the library
            provides a welcoming space for quiet study, creative exploration,
            and academic support. A user-friendly borrowing system ensures that
            materials are easily accessible, while teachers are encouraged to
            request resources that align with their instructional goals. The
            primary objectives of the library include developing strong reading
            habits, promoting the responsible use of information, strengthening
            research and literacy skills, and offering an inclusive environment
            where curiosity is encouraged and learning is celebrated.
          </>
        }
        image={image1}
      />
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7557.386304483815!2d76.040893!3d18.722551!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc53f1da217e163%3A0x63de28a31e6d4339!2sSharda%20English%20School%2C%20Kaij!5e0!3m2!1sen!2sin!4v1753445973927!5m2!1sen!2sin"
        width="70%"
        height="450"
        style={{
          border: 0,
          margin: "auto",
          display: "block",
          marginTop: "60px",
          marginBottom: "120px",
        }}
        allowfullscreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
}

export default AboutUs;
