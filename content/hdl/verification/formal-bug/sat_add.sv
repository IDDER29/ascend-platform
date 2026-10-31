// 4-bit saturating add, with the rules it must follow written as assertions.
module sat_add(input [3:0] a, input [3:0] b, output [3:0] y);
  wire [3:0] s = a + b;
  assign y = (s > 15) ? 4'd15 : s;

  always @* begin
    assert (y >= a && y >= b);                    // adding never makes it smaller
  end
endmodule
