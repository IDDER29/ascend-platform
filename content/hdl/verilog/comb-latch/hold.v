// Meant to be combinational: y follows d when en is 1, else 0. But the else is missing.
module pass(input en, input [3:0] d, output reg [3:0] y);
  always @* begin
    if (en) y = d;
  end
endmodule
