const express = require('express');
const router = express.Router();

const auth = require('../middlewares/authMiddleware');
const role = require('../middlewares/roleMiddleware');
const uploadProofMiddleware = require('../middlewares/proofUploadMiddleware');
const shipmentController = require('../controllers/shipmentController');



const {
  createShipment,
  getAllShipments,
  acceptShipment,
  confirmTransporter
  // Optionally add: updateLocation, markAsDelivered, etc.
} = require('../controllers/shipmentController');

// 🟢 Create a new shipment (Sender only)
router.post('/create', auth, role('sender'), createShipment);

// 🟡 Get all shipments (for dashboards)
router.get('/all', auth, getAllShipments);

// 🔵 Accept a shipment (Transporter only)
router.patch('/:id/accept', auth, role('transporter'), acceptShipment);

// 🟣 Confirm accepted transporter (Sender only)
router.patch('/:id/confirm', auth, role('sender'), confirmTransporter);

// ✅ You can add additional routes as needed:
// router.patch('/:id/location', auth, role('transporter'), updateLocation);
// router.patch('/:id/mark-delivered', auth, role('transporter'), markAsDelivered);

// Upload photo and video proof for a shipment
router.post(
  '/:shipmentId/upload-proof', // 🔥 Remove `/shipments`
  uploadProofMiddleware.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'video', maxCount: 1 }
  ]),
  shipmentController.uploadProof
);

module.exports = router;
