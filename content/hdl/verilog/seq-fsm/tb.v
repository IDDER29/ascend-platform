module tb;
  reg clk = 0, rst = 1, bit_in = 0;
  wire found;
  reg [9:0] stream = 10'b1101010011; // sent left to right
  integer i;
  detect101 dut(.clk(clk), .rst(rst), .bit_in(bit_in), .found(found));
  always #5 clk = ~clk;
  initial begin
    $dumpfile("waves.vcd");
    $dumpvars(0, tb);
    #12 rst = 0;
    for (i = 9; i >= 0; i = i - 1) begin
      bit_in = stream[i];
      @(posedge clk) #1 $display("in %b -> found %b", bit_in, found);
    end
    $finish;
  end
endmodule
