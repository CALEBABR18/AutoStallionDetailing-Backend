const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { findUserByEmail, createUser, updateUserPassword } = require('../models/userModel');

const register = async (req, res) => {
    const { firstName, lastName, email, password, phone, address } = req.body;
    if (!firstName || !lastName || !email || !password || !phone) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    try {
        const existing = await findUserByEmail(email);
        if (existing) return res.status(409).json({ message: 'Email already registered' });
        const hashedPassword = await bcrypt.hash(password, 10);
        await createUser({ firstName, lastName, email, password: hashedPassword, phone, address });
        res.status(201).json({ message: 'Registration successful' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'All fields required' });
    try {
        const user = await findUserByEmail(email);
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ message: 'Invalid credentials' });
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'lax' });
        res.json({ message: 'Login successful', user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email required' });
    try {
        const user = await findUserByEmail(email);
        if (!user) return res.status(404).json({ message: 'User not found' });
        const resetToken = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const resetUrl = `${process.env.FRONTEND_URL}/#/reset-password?token=${resetToken}`;
        // Send email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD }
        });
                                        await transporter.sendMail({
                                                        from: process.env.EMAIL_USER,
                                                        to: user.email,
                                                        subject: 'Auto Stallion - Password Reset',
                                                        html: `<table width="100%" bgcolor="#100f0f" cellpadding="0" cellspacing="0" style="padding:0;margin:0;background:#100f0f;">
                            <tr>
                                <td align="center">
                                    <table width="600" cellpadding="0" cellspacing="0" style="background:#181818;border-radius:16px;box-shadow:0 2px 16px rgba(0,0,0,0.18);padding:48px 32px;margin:48px 0;">
                                        <tr>
                                            <td align="center">
                                                <div style="font-size:32px;font-family:'Playfair Display',serif;font-weight:900;letter-spacing:2px;color:#c1902d;margin-bottom:8px;">AUTO STALLION</div>
                                                <h2 style="color:#fff;font-family:Arial,sans-serif;margin:24px 0 8px 0;">Password Reset Request</h2>
                                                <p style="color:#e0e0e0;font-size:18px;font-family:Arial,sans-serif;margin:0 0 18px 0;">Hello ${user.firstName},</p>
                                                <p style="color:#ccc;font-size:17px;font-family:Arial,sans-serif;margin:0 0 28px 0;">We received a request to reset your password. Click the button below to create a new password for your account.</p>
                                                <a href="${resetUrl}" style="display:inline-block;margin-top:18px;padding:16px 40px;background:#c1902d;color:#fff !important;text-decoration:none;border-radius:8px;font-size:20px;font-weight:bold;letter-spacing:1px;font-family:Arial,sans-serif;box-shadow:0 2px 8px rgba(193,144,45,0.15);">Reset Password</a>
                                                <p style="margin-top:36px;color:#888;font-size:14px;font-family:Arial,sans-serif;">If you did not request a password reset, you can safely ignore this email.</p>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>`
                });
        res.json({ message: 'Password reset email sent' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const resetPassword = async (req, res) => {
    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({ message: 'All fields required' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const hashedPassword = await bcrypt.hash(password, 10);
        await updateUserPassword(decoded.email, hashedPassword);
        res.json({ message: 'Password reset successful' });
    } catch (err) {
        res.status(400).json({ error: 'Invalid or expired token' });
    }
};

const logout = (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out' });
};

module.exports = { register, login, forgotPassword, resetPassword, logout };
