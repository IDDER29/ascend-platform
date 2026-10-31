// Meant to swap a and b on every clock edge. Uses non-blocking assignments (<=).
module swap(input clk, input load, output reg [3:0] a, output reg [3:0] b);
  always @(posedge clk) begin
    if (load) begin
      a <= 4'd3;
      b <= 4'd9;
    end else begin
      a <= b;
      b <= a;
    end
  end
endmodule
