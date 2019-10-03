/**
 * send
 *
 * @name send
 * @function send packet to worker and create a job
 * @access public
 */
module.exports = (worker, packet) => {
  worker.send(packet);
};
