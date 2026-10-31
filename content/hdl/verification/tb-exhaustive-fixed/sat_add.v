// 4-bit saturating add: a + b, but never more than 15.
module sat_add(input [3:0] a, input [3:0] b, output [3:0] y);
  wire [4:0] s = a + b;            // 5 bits: room for the carry
  assign y = s[4] ? 4'd15 : s[3:0];
endmodule
