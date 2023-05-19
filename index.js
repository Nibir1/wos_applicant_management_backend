const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

const multer = require("multer");
const path = require("path");

const dotenv = require("dotenv");
dotenv.config();

//middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

//ROUTES//

// ----------------------------------------------
const PORT = process.env.PORT || 4000;
app.listen(PORT,"0.0.0.0", () => console.log(`Server running on port ${PORT}`));

app.use("/", (req, res) => {
  res.send("Welcome To The WOSAM Backend");
});
// ----------------------------------------------

// This is responsible for multer system that allows for file uploading
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname +
        "_" +
        file.filename +
        Date.now() +
        path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

// This api takes user_infos and creates a new user into authorized_users
app.post(
  "/authorized_users/insert_user_infos",
  upload.fields([
    { user_name: "user_name" },
    { user_phone_number: "user_phone_number" },
    { user_email: "user_email" },
    { user_password: "user_password" },
    { user_designation: "user_designation" },
    { name: "user_image" },
  ]),

  async (req, res) => {
    const user_name = req.body.user_name;
    const user_phone_number = req.body.user_phone_number;
    const user_email = req.body.user_email;
    const user_password = req.body.user_password;
    const user_designation = req.body.user_designation;
    const user_image = req.files["user_image"][0].filename;

    const sql =
      "INSERT INTO authorized_users (user_name,user_phone_number,user_email,user_password,user_designation,user_image) VALUES($1,$2,$3,$4,$5,$6) RETURNING *";

    pool.query(
      sql,
      [
        user_name,
        user_phone_number,
        user_email,
        user_password,
        user_designation,
        user_image,
      ],
      (err, result) => {
        if (err) return res.json({ Message: "Error" });
        return res.json({ Status: "Success" });
      }
    );
  }
);

// Get the user_image based on the email address
app.get("/get_user_image/:user_email", async (req, res) => {
  const { user_email } = req.params;
  const sql = "SELECT user_image FROM authorized_users WHERE user_email=$1";
  pool.query(sql, [user_email], (err, result) => {
    if (err) return res.json("Error");
    return res.json(result);
  });
});

// This will allow to show the user_image
app.get("/images", async (req, res) => {
  try {
    const sql = "SELECT * FROM authorized_users";
    const result = await pool.query(sql);
    return res.json(result);
  } catch (err) {
    return res.json("Error");
  }
});

//get all user_informations
app.get("/get_user_infos", async (req, res) => {
  try {
    const user_infos = await pool.query("SELECT * FROM authorized_users");
    res.json(user_infos.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//get specific user_informations
app.get("/get_specific_user_infos/:user_email", async (req, res) => {
  try {
    const { user_email } = req.params;
    const user_infos = await pool.query(
      "SELECT * FROM authorized_users WHERE user_email=$1",
      [user_email]
    );
    res.json(user_infos.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// Update a specific user's informations
app.put(
  "/update_user_infos/:user_email",
  upload.fields([
    { user_name: "user_name" },
    { user_phone_number: "user_phone_number" },
    { user_password: "user_password" },
    { user_designation: "user_designation" },
    { name: "user_image" },
  ]),

  async (req, res) => {
    const { user_email } = req.params;

    const user_name = req.body.user_name;
    const user_phone_number = req.body.user_phone_number;
    const user_password = req.body.user_password;
    const user_designation = req.body.user_designation;
    const user_image = req.files["user_image"][0].filename;

    const sql =
      "UPDATE authorized_users SET user_name = $1, user_phone_number = $2, user_password = $3, user_designation = $4, user_image = $5 WHERE user_email = $6";
    pool.query(
      sql,
      [
        user_name,
        user_phone_number,
        user_password,
        user_designation,
        user_image,
        user_email,
      ],
      (err, result) => {
        if (err) return res.json({ Message: "Error" });
        return res.json({ Status: "Success" });
      }
    );
  }
);

//Delete a specific user
app.delete("/delete_user/:user_email", async (req, res) => {
  const { user_email } = req.params;
  const sql = "DELETE FROM authorized_users WHERE user_email = $1";
  pool.query(sql, [user_email], (err, result) => {
    if (err) return res.json({ Message: "Error" });
    return res.json({ Status: "Success" });
  });
});

// -------------------------------------------------------------------

// This api takes applicants infos and creates a new applicant into applicants table
app.post(
  "/insert_applicant_infos",
  upload.fields([
    { applicants_name: "applicants_name" },
    { fathers_name: "fathers_name" },
    { mothers_name: "mothers_name" },
    { applicants_Phone_Number: "applicants_Phone_Number" },
    { fathers_Phone_Number: "fathers_Phone_Number" },
    { mothers_Phone_Number: "mothers_Phone_Number" },
    { applicants_date_of_birth: "applicants_date_of_birth" },
    { fathers_date_of_birth: "fathers_date_of_birth" },
    { mothers_date_of_birth: "mothers_date_of_birth" },
    { admission_date: "admission_date" },
    { applicants_personal_email: "applicants_personal_email" },
    { email_by_WOS_for_applicant: "email_by_WOS_for_applicant" },
    { applicants_home_address: "applicants_home_address" },
    { applicants_messenger_link: "applicants_messenger_link" },
    { applicants_profession: "applicants_profession" },
    { visa_status: "visa_status" },
    { country_of_choice: "country_of_choice" },
    { name: "applicants_photo" },
    { name: "passport" },
    { name: "NID_Birth_Certificate" },
    { name: "applicants_cv" },
    { name: "recommendation_letter_1" },
    { name: "recommendation_letter_2" },
    { name: "SSc_transcript" },
    { name: "SSc_certificate" },
    { name: "HSc_transcript" },
    { name: "HSc_certificate" },
    { name: "BSc_transcript" },
    { name: "BSc_certificate" },
    { name: "MSc_transcript" },
    { name: "MSc_certificate" },
    { name: "english_certificate" },
  ]),

  async (req, res) => {
    const applicants_name = req.body.applicants_name;
    const fathers_name = req.body.fathers_name;
    const mothers_name = req.body.mothers_name;
    const applicants_Phone_Number = req.body.applicants_Phone_Number;
    const fathers_Phone_Number = req.body.fathers_Phone_Number;
    const mothers_Phone_Number = req.body.mothers_Phone_Number;
    const applicants_date_of_birth = req.body.applicants_date_of_birth;
    const fathers_date_of_birth = req.body.fathers_date_of_birth;
    const mothers_date_of_birth = req.body.mothers_date_of_birth;
    const admission_date = req.body.admission_date;
    const applicants_personal_email = req.body.applicants_personal_email;
    const email_by_WOS_for_applicant = req.body.email_by_WOS_for_applicant;
    const applicants_home_address = req.body.applicants_home_address;
    const applicants_messenger_link = req.body.applicants_messenger_link;
    const applicants_profession = req.body.applicants_profession;
    const visa_status = req.body.visa_status;
    const country_of_choice = req.body.country_of_choice;
    const applicants_photo = req.files["applicants_photo"][0].filename;
    const passport = req.files["passport"][0].filename;
    const NID_Birth_Certificate =
      req.files["NID_Birth_Certificate"][0].filename;
    const applicants_cv = req.files["applicants_cv"][0].filename;
    const recommendation_letter_1 =
      req.files["recommendation_letter_1"][0].filename;
    const recommendation_letter_2 =
      req.files["recommendation_letter_2"][0].filename;
    const SSc_transcript = req.files["SSc_transcript"][0].filename;
    const SSc_certificate = req.files["SSc_certificate"][0].filename;
    const HSc_transcript = req.files["HSc_transcript"][0].filename;
    const HSc_certificate = req.files["HSc_certificate"][0].filename;
    const BSc_transcript = req.files["BSc_transcript"][0].filename;
    const BSc_certificate = req.files["BSc_certificate"][0].filename;
    const MSc_transcript = req.files["MSc_transcript"][0].filename;
    const MSc_certificate = req.files["MSc_certificate"][0].filename;
    const english_certificate = req.files["english_certificate"][0].filename;

    const sql =
      "INSERT INTO applicants (applicants_name,fathers_name,mothers_name,applicants_Phone_Number,fathers_Phone_Number,mothers_Phone_Number,applicants_date_of_birth,fathers_date_of_birth,mothers_date_of_birth,admission_date,applicants_personal_email,email_by_WOS_for_applicant,applicants_home_address,applicants_messenger_link,applicants_profession,visa_status,country_of_choice,applicants_photo,passport,NID_Birth_Certificate,applicants_cv,recommendation_letter_1,recommendation_letter_2,SSc_transcript,SSc_certificate,HSc_transcript,HSc_certificate,BSc_transcript,BSc_certificate,MSc_transcript,MSc_certificate,english_certificate) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32) RETURNING *";

    pool.query(
      sql,
      [
        applicants_name,
        fathers_name,
        mothers_name,
        applicants_Phone_Number,
        fathers_Phone_Number,
        mothers_Phone_Number,
        applicants_date_of_birth,
        fathers_date_of_birth,
        mothers_date_of_birth,
        admission_date,
        applicants_personal_email,
        email_by_WOS_for_applicant,
        applicants_home_address,
        applicants_messenger_link,
        applicants_profession,
        visa_status,
        country_of_choice,
        applicants_photo,
        passport,
        NID_Birth_Certificate,
        applicants_cv,
        recommendation_letter_1,
        recommendation_letter_2,
        SSc_transcript,
        SSc_certificate,
        HSc_transcript,
        HSc_certificate,
        BSc_transcript,
        BSc_certificate,
        MSc_transcript,
        MSc_certificate,
        english_certificate,
      ],
      (err, result) => {
        if (err) return res.json({ Message: "Error" });
        return res.json({ Status: "Success" });
      }
    );
  }
);

//get specific applicant_informations
app.get(
  "/get_specific_applicant_infos/:applicants_personal_email",
  async (req, res) => {
    try {
      const { applicants_personal_email } = req.params;
      const applicant_infos = await pool.query(
        "SELECT * FROM applicants WHERE applicants_personal_email=$1",
        [applicants_personal_email]
      );
      res.json(applicant_infos.rows);
    } catch (err) {
      console.error(err.message);
    }
  }
);

// This api takes applicants infos and updates them in applicants table
app.put(
  "/update_applicant_infos/:user_email",
  upload.fields([
    { applicants_name: "applicants_name" },
    { fathers_name: "fathers_name" },
    { mothers_name: "mothers_name" },
    { applicants_Phone_Number: "applicants_Phone_Number" },
    { fathers_Phone_Number: "fathers_Phone_Number" },
    { mothers_Phone_Number: "mothers_Phone_Number" },
    { applicants_date_of_birth: "applicants_date_of_birth" },
    { fathers_date_of_birth: "fathers_date_of_birth" },
    { mothers_date_of_birth: "mothers_date_of_birth" },
    { admission_date: "admission_date" },
    { email_by_WOS_for_applicant: "email_by_WOS_for_applicant" },
    { applicants_home_address: "applicants_home_address" },
    { applicants_messenger_link: "applicants_messenger_link" },
    { applicants_profession: "applicants_profession" },
    { paid_i20_amount: "paid_i20_amount" },
    { paid_sevis_amount: "paid_sevis_amount" },
    { paid_after_visa_amount: "paid_after_visa_amount" },
    { i20_payment_status: "i20_payment_status" },
    { sevis_payment_status: "sevis_payment_status" },
    { after_visa_payment_status: "after_visa_payment_status" },
    { visa_status: "visa_status" },
    { country_of_choice: "country_of_choice" },
    { name: "applicants_photo" },
    { name: "passport" },
    { name: "NID_Birth_Certificate" },
    { name: "applicants_cv" },
    { name: "recommendation_letter_1" },
    { name: "recommendation_letter_2" },
    { name: "SSc_transcript" },
    { name: "SSc_certificate" },
    { name: "HSc_transcript" },
    { name: "HSc_certificate" },
    { name: "BSc_transcript" },
    { name: "BSc_certificate" },
    { name: "MSc_transcript" },
    { name: "MSc_certificate" },
    { name: "english_certificate" },
  ]),

  async (req, res) => {
    const { user_email } = req.params;

    const applicants_name = req.body.applicants_name;
    const fathers_name = req.body.fathers_name;
    const mothers_name = req.body.mothers_name;
    const applicants_Phone_Number = req.body.applicants_Phone_Number;
    const fathers_Phone_Number = req.body.fathers_Phone_Number;
    const mothers_Phone_Number = req.body.mothers_Phone_Number;
    const applicants_date_of_birth = req.body.applicants_date_of_birth;
    const fathers_date_of_birth = req.body.fathers_date_of_birth;
    const mothers_date_of_birth = req.body.mothers_date_of_birth;
    const admission_date = req.body.admission_date;
    const email_by_WOS_for_applicant = req.body.email_by_WOS_for_applicant;
    const applicants_home_address = req.body.applicants_home_address;
    const applicants_messenger_link = req.body.applicants_messenger_link;
    const applicants_profession = req.body.applicants_profession;
    const paid_i20_amount = req.body.paid_i20_amount;
    const paid_sevis_amount = req.body.paid_sevis_amount;
    const paid_after_visa_amount = req.body.paid_after_visa_amount;
    const i20_payment_status = req.body.i20_payment_status;
    const sevis_payment_status = req.body.sevis_payment_status;
    const after_visa_payment_status = req.body.after_visa_payment_status;
    const visa_status = req.body.visa_status;
    const country_of_choice = req.body.country_of_choice;
    const applicants_photo = req.files["applicants_photo"][0].filename;
    const passport = req.files["passport"][0].filename;
    const NID_Birth_Certificate =
      req.files["NID_Birth_Certificate"][0].filename;
    const applicants_cv = req.files["applicants_cv"][0].filename;
    const recommendation_letter_1 =
      req.files["recommendation_letter_1"][0].filename;
    const recommendation_letter_2 =
      req.files["recommendation_letter_2"][0].filename;
    const SSc_transcript = req.files["SSc_transcript"][0].filename;
    const SSc_certificate = req.files["SSc_certificate"][0].filename;
    const HSc_transcript = req.files["HSc_transcript"][0].filename;
    const HSc_certificate = req.files["HSc_certificate"][0].filename;
    const BSc_transcript = req.files["BSc_transcript"][0].filename;
    const BSc_certificate = req.files["BSc_certificate"][0].filename;
    const MSc_transcript = req.files["MSc_transcript"][0].filename;
    const MSc_certificate = req.files["MSc_certificate"][0].filename;
    const english_certificate = req.files["english_certificate"][0].filename;

    console.log(`The applicants photo is: ${applicants_photo}`);
    const sql =
      "UPDATE applicants SET applicants_name = $1, fathers_name = $2, mothers_name = $3, applicants_Phone_Number = $4, fathers_Phone_Number = $5, mothers_Phone_Number = $6, applicants_date_of_birth = $7, fathers_date_of_birth = $8, mothers_date_of_birth = $9, admission_date = $10, email_by_WOS_for_applicant = $11, applicants_home_address = $12, applicants_messenger_link = $13, applicants_profession = $14, paid_i20_amount = $15, paid_sevis_amount = $16, paid_after_visa_amount = $17, i20_payment_status = $18, sevis_payment_status = $19, after_visa_payment_status = $20, visa_status = $21, country_of_choice = $22, applicants_photo = $23, passport = $24, NID_Birth_Certificate = $25, applicants_cv = $26, recommendation_letter_1 = $27, recommendation_letter_2 = $28, SSc_transcript = $29, SSc_certificate = $30, HSc_transcript = $31, HSc_certificate = $32, BSc_transcript = $33, BSc_certificate = $34, MSc_transcript = $35, MSc_certificate = $36, english_certificate = $37 WHERE applicants_personal_email = $38";

    pool.query(
      sql,
      [
        applicants_name,
        fathers_name,
        mothers_name,
        applicants_Phone_Number,
        fathers_Phone_Number,
        mothers_Phone_Number,
        applicants_date_of_birth,
        fathers_date_of_birth,
        mothers_date_of_birth,
        admission_date,
        email_by_WOS_for_applicant,
        applicants_home_address,
        applicants_messenger_link,
        applicants_profession,
        paid_i20_amount,
        paid_sevis_amount,
        paid_after_visa_amount,
        i20_payment_status,
        sevis_payment_status,
        after_visa_payment_status,
        visa_status,
        country_of_choice,
        applicants_photo,
        passport,
        NID_Birth_Certificate,
        applicants_cv,
        recommendation_letter_1,
        recommendation_letter_2,
        SSc_transcript,
        SSc_certificate,
        HSc_transcript,
        HSc_certificate,
        BSc_transcript,
        BSc_certificate,
        MSc_transcript,
        MSc_certificate,
        english_certificate,
        user_email,
      ],
      (err, result) => {
        if (err) return res.json({ Message: "Error" });
        return res.json({ Status: "Success" });
      }
    );
  }
);

//Delete a Specific Applicant
app.delete(
  "/delete_applicant_from_applicants/:applicant_email",
  async (req, res) => {
    const { applicant_email } = req.params;
    const sql = "DELETE FROM applicants WHERE applicants_personal_email = $1";
    pool.query(sql, [applicant_email], (err, result) => {
      if (err) return res.json({ Message: "Error" });
      return res.json({ Status: "Success" });
    });
  }
);

// This api takes DS160 infos and stores them into DS160 table
app.post(
  "/insert_ds160_infos",
  upload.fields([
    { applicants_personal_email_Address: "applicants_personal_email_Address" },
    { name_provided: "name_provided" },
    { sex: "sex" },
    { marital_status: "marital_status" },
    { applicants_date_of_birth: "applicants_date_of_birth" },
    { place_of_birth: "place_of_birth" },
    { national_identification_number: "national_identification_number" },
    { home_address: "home_address" },
    { city: "city" },
    { postal_zone_ZIP_code: "postal_zone_ZIP_code" },
    { same_mailing_address: "same_mailing_address" },
    { primary_phone_number: "primary_phone_number" },
    { secondary_phone_number: "secondary_phone_number" },
    { email_address: "email_address" },
    { additional_email_address: "additional_email_address" },
    { social_media_platform: "social_media_platform" },
    { social_media_identifier: "social_media_identifier" },
    { passport_travel_document_type: "passport_travel_document_type" },
    { passport_travel_document_number: "passport_travel_document_number" },
    { passport_issuance_date: "passport_issuance_date" },
    { passport_expiration_date: "passport_expiration_date" },
    { purpose_of_trip_to_the_U_S: "purpose_of_trip_to_the_U_S" },
    { intended_date_of_arrival: "intended_date_of_arrival" },
    { intended_length_of_stay_in_U_S: "intended_length_of_stay_in_U_S" },
    {
      address_where_you_will_stay_in_the_U_S:
        "address_where_you_will_stay_in_the_U_S",
    },
    { person_paying_for_your_trip: "person_paying_for_your_trip" },
    { paying_persons_telephone_number: "paying_persons_telephone_number" },
    { paying_persons_email_address: "paying_persons_email_address" },
    {
      paying_persons_relationship_to_you: "paying_persons_relationship_to_you",
    },
    { contact_person_name_in_the_U_S: "contact_person_name_in_the_U_S" },
    { organization_name_in_the_U_S: "organization_name_in_the_U_S" },
    {
      paying_persons_relationship_to_you2nd:
        "paying_persons_relationship_to_you2nd",
    },
    { us_contact_address: "us_contact_address" },
    { phone_number: "phone_number" },
    { email_address2nd: "email_address2nd" },
    { fathers_surnames: "fathers_surnames" },
    { fathers_given_names: "fathers_given_names" },
    { fathers_date_of_birth: "fathers_date_of_birth" },
    { is_your_father_in_the_U_S: "is_your_father_in_the_U_S" },
    { mothers_surnames: "mothers_surnames" },
    { mothers_given_names: "mothers_given_names" },
    { mothers_date_of_birth: "mothers_date_of_birth" },
    { is_your_mother_in_the_U_S: "is_your_mother_in_the_U_S" },
    { primary_occupation: "primary_occupation" },
    { present_employer_or_school_name: "present_employer_or_school_name" },
    { address: "address" },
    { city2nd: "city2nd" },
    { postal_zone_ZIP_code2nd: "postal_zone_ZIP_code2nd" },
    { country_region: "country_region" },
    { work_phone_number: "work_phone_number" },
    { name_of_institution: "name_of_institution" },
    { city_of_institution: "city_of_institution" },
    {
      postal_zone_ZIP_code_of_institution:
        "postal_zone_ZIP_code_of_institution",
    },
    { country_region_of_institution: "country_region_of_institution" },
    { course_of_study: "course_of_study" },
    { date_of_attendance_from: "date_of_attendance_from" },
    { date_of_attendance_to: "date_of_attendance_to" },
    { language_name_1: "language_name_1" },
    { language_name_2: "language_name_2" },
    { name_of_organization_1: "name_of_organization_1" },
    { name_of_organization_2: "name_of_organization_2" },
    { name_of_organization_3: "name_of_organization_3" },
    { name_of_organization_4: "name_of_organization_4" },
    { name_of_organization_5: "name_of_organization_5" },
    { name_1: "name_1" },
    { name1_street_address: "name1_street_address" },
    { name1_city: "name1_city" },
    { name1_postal_zone_ZIP_code: "name1_postal_zone_ZIP_code" },
    { name1_country_region: "name1_country_region" },
    { name1_telephone_number: "name1_telephone_number" },
    { name1_email_address: "name1_email_address" },
    { name_2: "name_2" },
    { name2_street_address: "name2_street_address" },
    { name2_city: "name2_city" },
    { name2_postal_zone_ZIP_code: "name2_postal_zone_ZIP_code" },
    { name2_country_region: "name2_country_region" },
    { name2_telephone_number: "name2_telephone_number" },
    { name2_email_address: "name2_email_address" },
    { sevis_id: "sevis_id" },
    { name_of_school: "name_of_school" },
    { course_of_study2nd: "course_of_study2nd" },
    { street_address: "street_address" },
  ]),

  async (req, res) => {
    const applicants_personal_email_Address =
      req.body.applicants_personal_email_Address;
    const name_provided = req.body.name_provided;
    const sex = req.body.sex;
    const marital_status = req.body.marital_status;
    const applicants_date_of_birth = req.body.applicants_date_of_birth;
    const place_of_birth = req.body.place_of_birth;
    const national_identification_number =
      req.body.national_identification_number;
    const home_address = req.body.home_address;
    const city = req.body.city;
    const postal_zone_ZIP_code = req.body.postal_zone_ZIP_code;
    const same_mailing_address = req.body.same_mailing_address;
    const primary_phone_number = req.body.primary_phone_number;
    const secondary_phone_number = req.body.secondary_phone_number;
    const email_address = req.body.email_address;
    const additional_email_address = req.body.additional_email_address;
    const social_media_platform = req.body.social_media_platform;
    const social_media_identifier = req.body.social_media_identifier;
    const passport_travel_document_type =
      req.body.passport_travel_document_type;
    const passport_travel_document_number =
      req.body.passport_travel_document_number;
    const passport_issuance_date = req.body.passport_issuance_date;
    const passport_expiration_date = req.body.passport_expiration_date;
    const purpose_of_trip_to_the_U_S = req.body.purpose_of_trip_to_the_U_S;
    const intended_date_of_arrival = req.body.intended_date_of_arrival;
    const intended_length_of_stay_in_U_S =
      req.body.intended_length_of_stay_in_U_S;
    const address_where_you_will_stay_in_the_U_S =
      req.body.address_where_you_will_stay_in_the_U_S;
    const person_paying_for_your_trip = req.body.person_paying_for_your_trip;
    const paying_persons_telephone_number =
      req.body.paying_persons_telephone_number;
    const paying_persons_email_address = req.body.paying_persons_email_address;
    const paying_persons_relationship_to_you =
      req.body.paying_persons_relationship_to_you;
    const contact_person_name_in_the_U_S =
      req.body.contact_person_name_in_the_U_S;
    const organization_name_in_the_U_S = req.body.organization_name_in_the_U_S;
    const paying_persons_relationship_to_you2nd =
      req.body.paying_persons_relationship_to_you2nd;
    const us_contact_address = req.body.us_contact_address;
    const phone_number = req.body.phone_number;
    const email_address2nd = req.body.email_address2nd;
    const fathers_surnames = req.body.fathers_surnames;
    const fathers_given_names = req.body.fathers_given_names;
    const fathers_date_of_birth = req.body.fathers_date_of_birth;
    const is_your_father_in_the_U_S = req.body.is_your_father_in_the_U_S;
    const mothers_surnames = req.body.mothers_surnames;
    const mothers_given_names = req.body.mothers_given_names;
    const mothers_date_of_birth = req.body.mothers_date_of_birth;
    const is_your_mother_in_the_U_S = req.body.is_your_mother_in_the_U_S;
    const primary_occupation = req.body.primary_occupation;
    const present_employer_or_school_name =
      req.body.present_employer_or_school_name;
    const address = req.body.address;
    const city2nd = req.body.city2nd;
    const postal_zone_ZIP_code2nd = req.body.postal_zone_ZIP_code2nd;
    const country_region = req.body.country_region;
    const work_phone_number = req.body.work_phone_number;
    const name_of_institution = req.body.name_of_institution;
    const city_of_institution = req.body.city_of_institution;
    const postal_zone_ZIP_code_of_institution =
      req.body.postal_zone_ZIP_code_of_institution;
    const country_region_of_institution =
      req.body.country_region_of_institution;
    const course_of_study = req.body.course_of_study;
    const date_of_attendance_from = req.body.date_of_attendance_from;
    const date_of_attendance_to = req.body.date_of_attendance_to;
    const language_name_1 = req.body.language_name_1;
    const language_name_2 = req.body.language_name_2;
    const name_of_organization_1 = req.body.name_of_organization_1;
    const name_of_organization_2 = req.body.name_of_organization_2;
    const name_of_organization_3 = req.body.name_of_organization_3;
    const name_of_organization_4 = req.body.name_of_organization_4;
    const name_of_organization_5 = req.body.name_of_organization_5;
    const name_1 = req.body.name_1;
    const name1_street_address = req.body.name1_street_address;
    const name1_city = req.body.name1_city;
    const name1_postal_zone_ZIP_code = req.body.name1_postal_zone_ZIP_code;
    const name1_country_region = req.body.name1_country_region;
    const name1_telephone_number = req.body.name1_telephone_number;
    const name1_email_address = req.body.name1_email_address;
    const name_2 = req.body.name_2;
    const name2_street_address = req.body.name2_street_address;
    const name2_city = req.body.name2_city;
    const name2_postal_zone_ZIP_code = req.body.name2_postal_zone_ZIP_code;
    const name2_country_region = req.body.name2_country_region;
    const name2_telephone_number = req.body.name2_telephone_number;
    const name2_email_address = req.body.name2_email_address;
    const sevis_id = req.body.sevis_id;
    const name_of_school = req.body.name_of_school;
    const course_of_study2nd = req.body.course_of_study2nd;
    const street_address = req.body.street_address;
    // 82
    const sql =
      "INSERT INTO ds160 (applicants_personal_email_Address,name_provided,sex,marital_status,applicants_date_of_birth,place_of_birth,national_identification_number,home_address,city,postal_zone_ZIP_code,same_mailing_address,primary_phone_number,secondary_phone_number,email_address,additional_email_address,social_media_platform,social_media_identifier,passport_travel_document_type,passport_travel_document_number,passport_issuance_date,passport_expiration_date,purpose_of_trip_to_the_U_S,intended_date_of_arrival,intended_length_of_stay_in_U_S,address_where_you_will_stay_in_the_U_S,person_paying_for_your_trip,paying_persons_telephone_number,paying_persons_email_address,paying_persons_relationship_to_you,contact_person_name_in_the_U_S,organization_name_in_the_U_S,paying_persons_relationship_to_you2nd,us_contact_address,phone_number,email_address2nd,fathers_surnames,fathers_given_names,fathers_date_of_birth,is_your_father_in_the_U_S,mothers_surnames,mothers_given_names,mothers_date_of_birth,is_your_mother_in_the_U_S,primary_occupation,present_employer_or_school_name,address,city2nd,postal_zone_ZIP_code2nd,country_region,work_phone_number,name_of_institution,city_of_institution,postal_zone_ZIP_code_of_institution,country_region_of_institution,course_of_study,date_of_attendance_from,date_of_attendance_to,language_name_1,language_name_2,name_of_organization_1,name_of_organization_2,name_of_organization_3,name_of_organization_4,name_of_organization_5,name_1,name1_street_address,name1_city,name1_postal_zone_ZIP_code,name1_country_region,name1_telephone_number,name1_email_address,name_2,name2_street_address,name2_city,name2_postal_zone_ZIP_code,name2_country_region,name2_telephone_number,name2_email_address,sevis_id,name_of_school,course_of_study2nd,street_address) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43, $44, $45, $46, $47, $48, $49, $50, $51, $52, $53, $54, $55, $56, $57, $58, $59, $60, $61, $62, $63, $64, $65, $66, $67, $68, $69, $70, $71, $72, $73, $74, $75, $76, $77, $78, $79, $80, $81, $82) RETURNING *";

    pool.query(
      sql,
      [
        applicants_personal_email_Address,
        name_provided,
        sex,
        marital_status,
        applicants_date_of_birth,
        place_of_birth,
        national_identification_number,
        home_address,
        city,
        postal_zone_ZIP_code,
        same_mailing_address,
        primary_phone_number,
        secondary_phone_number,
        email_address,
        additional_email_address,
        social_media_platform,
        social_media_identifier,
        passport_travel_document_type,
        passport_travel_document_number,
        passport_issuance_date,
        passport_expiration_date,
        purpose_of_trip_to_the_U_S,
        intended_date_of_arrival,
        intended_length_of_stay_in_U_S,
        address_where_you_will_stay_in_the_U_S,
        person_paying_for_your_trip,
        paying_persons_telephone_number,
        paying_persons_email_address,
        paying_persons_relationship_to_you,
        contact_person_name_in_the_U_S,
        organization_name_in_the_U_S,
        paying_persons_relationship_to_you2nd,
        us_contact_address,
        phone_number,
        email_address2nd,
        fathers_surnames,
        fathers_given_names,
        fathers_date_of_birth,
        is_your_father_in_the_U_S,
        mothers_surnames,
        mothers_given_names,
        mothers_date_of_birth,
        is_your_mother_in_the_U_S,
        primary_occupation,
        present_employer_or_school_name,
        address,
        city2nd,
        postal_zone_ZIP_code2nd,
        country_region,
        work_phone_number,
        name_of_institution,
        city_of_institution,
        postal_zone_ZIP_code_of_institution,
        country_region_of_institution,
        course_of_study,
        date_of_attendance_from,
        date_of_attendance_to,
        language_name_1,
        language_name_2,
        name_of_organization_1,
        name_of_organization_2,
        name_of_organization_3,
        name_of_organization_4,
        name_of_organization_5,
        name_1,
        name1_street_address,
        name1_city,
        name1_postal_zone_ZIP_code,
        name1_country_region,
        name1_telephone_number,
        name1_email_address,
        name_2,
        name2_street_address,
        name2_city,
        name2_postal_zone_ZIP_code,
        name2_country_region,
        name2_telephone_number,
        name2_email_address,
        sevis_id,
        name_of_school,
        course_of_study2nd,
        street_address,
      ],
      (err, result) => {
        if (err) return res.json({ Message: "Error" });
        return res.json({ Status: "Success" });
      }
    );
  }
);

//get specific applicants ds160 informations
app.get("/get_ds160_infos/:applicants_personal_email", async (req, res) => {
  try {
    const { applicants_personal_email } = req.params;
    const applicant_ds160_infos = await pool.query(
      "SELECT * FROM ds160 WHERE applicants_personal_email_address=$1",
      [applicants_personal_email]
    );
    res.json(applicant_ds160_infos.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//Delete a Specific Applicants DS160 Informations
app.delete(
  "/delete_applicants_ds160_informations/:applicant_email",
  async (req, res) => {
    const { applicant_email } = req.params;
    const sql =
      "DELETE FROM ds160 WHERE applicants_personal_email_address = $1";
    pool.query(sql, [applicant_email], (err, result) => {
      if (err) return res.json({ Message: "Error" });
      return res.json({ Status: "Success" });
    });
  }
);
