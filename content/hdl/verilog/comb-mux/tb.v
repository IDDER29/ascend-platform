module tb;
  reg [3:0] in;
  reg [1:0] sel;
  wire y1, y2;
  integer i, mismatches = 0;
  mux4_assign m1(.in(in), .sel(sel), .y(y1));
  mux4_case   m2(.in(in), .sel(sel), .y(y2));
  initial begin
    in = 4'b1010;
    for (i = 0; i < 4; i = i + 1) begin
      sel = i;
      #1 $display("in=%b sel=%0d -> %b %b", in, sel, y1, y2);
    end
    for (i = 0; i < 64; i = i + 1) begin
      {in, sel} = i;
      #1 if (y1 !== y2) mismatches = mismatches + 1;
    end
    $display("checked all 64 inputs: %0d mismatches", mismatches);
    $finish;
  end
endmodule
