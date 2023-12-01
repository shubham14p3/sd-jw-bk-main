const { secret } = require("../config/secret");
const stripe = require("stripe")(secret.stripe_key);
const Order = require("../model/Order");
const { sendEmail } = require("../config/email");
// create-payment-intent
exports.paymentIntent = async (req, res, next) => {
  try {
    const product = req.body;
    const price = Number(product.price);
    const amount = price * 100;
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      currency: "usd",
      amount: amount,
      payment_method_types: ["card"],
    });
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
// addOrder
exports.addOrder = async (req, res, next) => {
  try {
    const orderItems = await Order.create(req.body);
    const mailData = {
      from: secret.email_user,
      to: `${orderItems.email}`,
      subject: "Order Confirmation",
      subject: "Order Confirmation",
      html: `<h2>Hello ${orderItems.name}</h2>
      <p>Order Confirmation into your <strong>shofy</strong> account.</p>

        <p>This link will expire in <strong> 10 minute</strong>.</p>

        <p style="margin-bottom:20px;">Click this link for active your account</p>

        <p style="margin-top: 35px;">If you did not initiate this request, please contact us immediately at support@shofy.com</p>

        <p style="margin-bottom:0px;">Thank you</p>
        <strong>shofy Team</strong>
         `,
    };
    const message = "Please check your email for order!";
    sendEmail(mailData, res, message);
    res.status(200).json({
      success: true,
      message: "Order added successfully",
      order: orderItems,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
// get Orders
exports.getOrders = async (req, res, next) => {
  try {
    const orderItems = await Order.find({}).populate("user");
    res.status(200).json({
      success: true,
      data: orderItems,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
// get Orders
exports.getSingleOrder = async (req, res, next) => {
  try {
    const orderItem = await Order.findById(req.params.id).populate("user");
    res.status(200).json(orderItem);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.updateOrderStatus = async (req, res) => {
  const newStatus = req.body.status;
  try {
    await Order.updateOne(
      {
        _id: req.params.id,
      },
      {
        $set: {
          status: newStatus,
        },
      },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Status updated successfully",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
