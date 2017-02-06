const util = require("./util");

test("parseRTPPacket", () => {

});

test("parseRTCPPacket", () => {

});

test("getMD5Hash", () => {
  const input = "123456";
  const expected = "e10adc3949ba59abbe56e057f20f883e";

  expect(util.getMD5Hash(input)).toBe(expected);
});

test("parseTransport", () => {
  // taken from https://en.wikipedia.org/wiki/Real_Time_Streaming_Protocol
  const input = "RTP/AVP;unicast;client_port=8000-8001;server_port=9000-9001;ssrc=1234ABCD";
  const output = util.parseTransport(input); 

  expect(Object.keys(output)).toEqual(["client_port", "server_port", "ssrc"]);

  expect(output.client_port).toBe("8000-8001");
  expect(output.server_port).toBe("9000-9001");
  expect(output.ssrc).toBe("1234ABCD");
});