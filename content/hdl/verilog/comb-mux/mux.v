// A 4-to-1 multiplexer, written two ways: with ?: and with a case statement.
module mux4_assign(input [3:0] in, input [1:0] sel, output y);
  assign y = sel[1] ? (sel[0] ? in[3] : in[2]) : (sel[0] ? in[1] : in[0]);
endmodule

module mux4_case(input [3:0] in, input [1:0] sel, output reg y);
  always @* begin
    case (sel)
      2'd0: y = in[0];
      2'd1: y = in[1];
      2'd2: y = in[2];
      default: y = in[3];
    endcase
  end
endmodule
