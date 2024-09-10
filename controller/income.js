const Income = require("../model/income");
const Joi = require("joi");

async function saveIncome(req, res) {
  try {
    const IncomeSchema = Joi.object({
      sales: Joi.number().required().min(1),
      expenses: Joi.number().required().min(1),
    });
    let status = IncomeSchema.validate(req.body, {
      allowUnknown: true,
      abortEarly: false,
    });
    if (status.error) {
      let errors = status.error.details.map((detail) => {
        return {
          message: detail.message,
          field: detail.context.key,
        };
      });
      return res.status(400).send({
        msg: "Bad request",
        errors,
      });
    }
    const { sales, expenses } = req.body;

    let profit = sales - expenses;

    let income = await Income.create({
      ...req.body,
      profit: profit,
    });

    return res.send(income);
  } catch (err) {
    console.error(err);
    return res.status(500).send(`Error: ${err.message}`);
  }
}

async function fetchIncome(req, res) {
  try {
    let result = await Income.find();
    const totalProfit = await Income.aggregate([
      {
        $group: {
          _id: null,
          totalProfit: { $sum: "$profit" },
        },
      },
    ]);

    res.send({
      profitData: result,
      totalProfit: totalProfit,
    });
  } catch (err) {
    console.log("Error", err);
    res.status(500).send("Server Error");
  }
}

module.exports = { saveIncome, fetchIncome };
