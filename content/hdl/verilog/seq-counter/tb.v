module tb;
  reg clk = 0, rst = 1;
  wire [3:0] count;
  counter dut(.clk(clk), .rst(rst), .count(count));
  always #5 clk = ~clk; // a clock with a period of 10
  initial begin
    $dumpfile("waves.vcd");
    $dumpvars(0, tb);
    #12 rst = 0;
    #60 $display("count after 6 rising edges out of reset: %0d", count);
    $finish;
  end
endmodule
