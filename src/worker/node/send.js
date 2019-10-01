/**
 * send
 *
 * @name send
 * @function send packet to worker and create a job
 * @access public
 * @param {object} instance TesseractWorker instance
 * @param {object} iPacket data for worker
 */
module.exports = (worker, packet) => {
  worker.send(packet);
};
