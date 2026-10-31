module tb;
  reg clk = 0, load = 1;
  wire [3:0] a, b;
  swap dut(.clk(clk), .load(load), .a(a), .b(b));
  always #5 clk = ~clk;
  initial begin
    $dumpfile("waves.vcd");
    $dumpvars(0, tb);
    #12 load = 0;
    #30 $display("after 3 swaps: a = %0d, b = %0d", a, b);
    $finish;
  end
endmodule
