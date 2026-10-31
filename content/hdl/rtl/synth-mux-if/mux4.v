// The same 4-to-1 multiplexer, written as a chain of if and else.
module mux4(input [1:0] sel, input [7:0] a, input [7:0] b, input [7:0] c, input [7:0] d, output reg [7:0] y);
  always @* begin
    if (sel == 2'd0) y = a;
    else if (sel == 2'd1) y = b;
    else if (sel == 2'd2) y = c;
    else y = d;
  end
endmodule
