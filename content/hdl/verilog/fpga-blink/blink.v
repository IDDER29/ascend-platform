// Blink an LED about once a second from a 12 MHz board clock: a 24-bit counter's top bit
// changes every 2^23 cycles, which is 0.7 seconds at 12 MHz.
module blink(input clk, output led);
  reg [23:0] count = 0;
  always @(posedge clk) count <= count + 1;
  assign led = count[23];
endmodule
