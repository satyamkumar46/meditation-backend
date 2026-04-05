import { resend } from '../config/resend.js';
import { supabase } from '../config/supabase.js';

export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Expiry (5 minutes)
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // Send Email via Resend
    await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Your OTP Code',
        html: `
          <h2>Password Reset OTP</h2>
          <p>Your OTP is:</p>
          <h1>${otp}</h1>
          <p>This OTP will expire in 5 minutes.</p>
        `,
      });
  
      res.json({ message: "OTP sent successfully 📧" });

    // Save OTP in Supabase
    const { error: dbError } = await supabase
      .from('otp_table')
      .insert({
        email,
        otp,
        expires_at: expiresAt
      });

    if (dbError) {
        console.log("db error",dbError);
      return res.status(500).json({ error: dbError.message });
    }

    

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};