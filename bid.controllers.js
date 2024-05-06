const { default: mongoose } = require("mongoose");

const bidSchema = new mongoose.Schema({
    name: String,
    value: String,
    shoeName: String,
    status: {
        type: String,
        default: "Open",
    },
    bids: [{
        bidUser: String,
        bidPrice: Number
    }],
    createdAt: { type: Date, default: Date.now },
});

const Bid = mongoose.model("Bid", bidSchema);
const startBid = async (req, res) => {
    const { name, value, shoeName } = req.body;
    try {
        let existingBid = await Bid.findOne({ shoeName: shoeName });

        if (!existingBid) {
            // If no bid exists for the shoe, create a new bid document
            const newBid = new Bid({
                name,
                value,
                shoeName,
                bids: [{ bidUser: name, bidPrice: value }]
            });
            await newBid.save();
            return res.status(200).json(newBid);
        }

        // If a bid exists for the shoe, add a new object to the bids array
        existingBid.bids.push({ bidUser: name, bidPrice: value });
        await existingBid.save();
        return res.status(200).json(existingBid);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

const updateBid = async (req, res) => {
    const { shoeName, bidUser, bidPrice } = req.body;
    try {
        let bid = await Bid.findOne({ shoeName: shoeName });
        bid.bids.push({ bidUser: bidUser, bidPrice: bidPrice });
        await bid.save();
        return res.status(200).json({
            bid
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

const getBid = async (req, res) => {
    const { shoeName } = req.body;
    console.log(shoeName);
    try {
        const getExistingBid = await Bid.findOne({
            shoeName: shoeName,
            status: "Open"
        })
        if (getExistingBid) {
            return res.status(200).json({
                getExistingBid
            })
        }
        return res.status(404).json({
            message: "Bid not found"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}


const closeBid = async (req, res) => {
    const { shoeName } = req.body;
    try {
        const getExistingBid = await Bid.findOne({
            shoeName: shoeName
        })
        if (getExistingBid) {
            const newBid = await Bid.findOneAndUpdate({
                shoeName: shoeName
            }, {
                $set: {
                    status: "Closed"
                }
            }, { new: true })
            return res.status(200).json({
                newBid
            })
        }
        return res.status(404).json({
            message: "Bid not found"
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

const getAllBids = async (req, res) => {
    try {
        const allBids = await Bid.find({})
        if (allBids) {
            return res.status(200).json({
                allBids
            })
        }
        return res.status(404).json({
            message: "No bids found"
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error"
        })
    }

}

module.exports = {
    startBid,
    updateBid,
    getBid,
    closeBid,
    getAllBids
}