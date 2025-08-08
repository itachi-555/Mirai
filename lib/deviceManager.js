const Devices = new Map();

function addDevice(device, ws) {
  const deviceList = Devices.get(device) || [];
  deviceList.push(ws);
  Devices.set(device, deviceList);
}

function removeDevice(device, ws) {
  const list = Devices.get(device);
  if (list) {
    const index = list.indexOf(ws);
    if (index !== -1) list.splice(index, 1);
    if (list.length === 0) Devices.delete(device);
  }
}

function getDeviceList(device) {
  return Devices.get(device);
}

module.exports = { addDevice, removeDevice, getDeviceList };
