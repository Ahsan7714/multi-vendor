const bcrypt = require("bcrypt");
const cloudinary=require("cloudinary")
const User = require("../models/user");
const catchAsyncErrors = require("../middelware/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const sendToken = require("../utils/jwtToken.js");
const crypto=require("crypto")
const Token=require("../models/token")
const sendEmail=require("../utils/sendEmail")
// REGISTER A USER 
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { username, email, password, role } = req.body;
 

  // Check if the user already exists with the provided email
  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(new ErrorHandler("User already exists", 400));
  }




  // Create a new user
  const user = new User({
    username,
    email,
    password,
    role,
  });

  // Save the new user to the database
  await user.save();

  sendToken(user, 201, res);
});

// LOGIN USER
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // checking if user has given password and email both

  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Email & Password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password,next);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  sendToken(user, 200, res);
});

// LOGOUT USER
exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

exports.getUser = catchAsyncErrors(async (req, res, next) => {
  const { userId } = req.body;

  // Find the user by ID
  const user = await User.findById(userId);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  res.status(200).json({ user });
});
// FORGAT PASSWORD
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const tokenExist = await Token.findOne({ userId: user._id });

  // Get ResetPassword Token
  const resetToken = crypto.randomBytes(32).toString("hex");

  let token;

  if (tokenExist) {
    token = await Token.findByIdAndUpdate(tokenExist._id, { token: resetToken });
  } else {
    token = await Token.create({
      userId: user._id,
      token: resetToken,
    });
  }


  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/password/reset/${resetToken}`;

  const message = `
  <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 20px;
        }
        h1 {
          color: #333;
          font-size: 24px;
          margin-bottom: 20px;
        }
        p {
          color: #555;
          font-size: 16px;
          line-height: 1.5;
          margin-bottom: 10px;
        }
        .button {
          display: inline-block;
          background-color: #3498db;
          color: #ffff;
          text-decoration: none;
          padding: 10px 20px;
          border-radius: 4px;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <h1>Reset Your Password</h1>
      <p>Hello,</p>
      <p>
        We received a request to reset your password. To proceed with the
        password reset, please use the following token:
      </p>
      <p>
        If you did not request a password reset, please disregard this email.
        Your account is still secure.
      </p>
      <p>
        Click the button below to reset your password. This token will expire
        after 24 hours.
      </p>
      <a href="${resetPasswordUrl}" class="button">Reset Password</a>
      <p>
        If you have any questions or need further assistance, please contact
        our support team.
      </p>
      <p>Best regards,</p>
      <p>The Support Team</p>
    </body>
  </html>
`;


  try {
    await sendEmail({
      email: user.email,
      subject: `Multi Vendor Password Recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    token.userId = undefined;
    token.token = undefined;

    return next(new ErrorHandler(error.message, 500));
  }
});

// Reset Password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
const user=await User.findOne({email:req.body.email})
  const token = await Token.findOne({
    token:req.params.token,
    userId:user._id
  });

  if (!token) {
    return next(
      new ErrorHandler(
        "Reset Password Token is invalid or has been expired",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not password", 400));
  }

  user.password = req.body.password;
  await Token.findByIdAndDelete(token._id)

  await user.save();

  sendToken(user, 200, res);
});


// update User password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id)

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old password is incorrect", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }

  user.password = req.body.newPassword;

  await user.save();

  sendToken(user, 200, res);
});

