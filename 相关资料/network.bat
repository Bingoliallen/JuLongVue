route delete 0.0.0.0 -p
route delete 192.0.0.0 -p
route delete 172.0.0.0 -p
route delete 10.0.0.0 -p
route delete 20.0.0.0 -p

route add 192.0.0.0 mask 255.0.0.0 10.11.0.1 metric 999 -p
route add 172.0.0.0 mask 255.0.0.0 10.11.0.1 metric 999 -p
route add 20.0.0.0 MASK 255.0.0.0 10.11.0.1 METRIC 999 -p
route add 10.0.0.0 mask 255.0.0.0 10.11.0.1 metric 999 -p
route add 0.0.0.0 mask 0.0.0.0 10.100.0.1  metric 1 -p

