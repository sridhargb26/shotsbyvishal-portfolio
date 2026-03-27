import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  const { name, email, subject, message } = await req.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"${name}" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO || process.env.EMAIL_USER,
      replyTo: email,
      subject: `[ShotsByVishal] ${subject || "New enquiry"}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #f2ede6; padding: 40px; border: 1px solid #222;">
          <h2 style="color: #c9a84c; font-size: 24px; margin-bottom: 24px;">New Enquiry</h2>
          <p><strong style="color: #c9a84c;">Name:</strong> ${name}</p>
          <p><strong style="color: #c9a84c;">Email:</strong> ${email}</p>
          <p><strong style="color: #c9a84c;">Subject:</strong> ${subject}</p>
          <hr style="border-color: #222; margin: 24px 0;" />
          <p style="line-height: 1.8; color: #aaa;">${message.replace(/\n/g, "<br/>")}</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Email error:", err);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
