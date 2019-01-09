#!/usr/bin/env python3
import sys
#sys.path.append('/DevSpace/Espree/burndi/app')
sys.path.append('./app')

# from crc16 import _crc16
from crc16 import crc16pure
import crc16


# data="00020101021129370016A000000677010111011300660000000005802TH53037646304";

def main():
    #so_bytes = so_string.encode( )
    data=sys.argv[1]
    tmp=crc16.crc16xmodem(data.encode( ),0xFFFF)

    # print(tmp)

    return print(format(tmp, '02x'));

#start process
if __name__ == '__main__':
    main()



