// 4-bit saturating add, with the rules it must follow written as assertions.
module sat_add(input [3:0] a, input [3:0] b, output [3:0] y);
  wire [4:0] s = a + b;
  assign y = s[4] ? 4'd15 : s[3:0];

  always @* begin
    assert (y >= a && y >= b);                    // adding never makes it smaller
    assert (s > 15 ? y == 15 : y == s[3:0]);      // exactly the saturated sum
  end
endmodule
