// The fix: give y a value on every path through the block (here, a default first).
module pass(input en, input [3:0] d, output reg [3:0] y);
  always @* begin
    y = 4'd0;
    if (en) y = d;
  end
endmodule
