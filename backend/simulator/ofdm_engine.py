import numpy as np
N=64
ACTIVE=np.r_[np.arange(-26,0),np.arange(1,27)]
PILOTS=np.array([-21,-7,7,21]); PV=np.array([1,1,1,-1],complex)
DATA=np.array([x for x in ACTIVE if x not in PILOTS])
def idx(k): return k%N
def qpsk_mod(b):
 b=np.asarray(b,int)
 if len(b)%2:b=np.r_[b,0]
 m={(0,0):1+1j,(0,1):-1+1j,(1,1):-1-1j,(1,0):1-1j}
 return np.array([m[tuple(x)] for x in b.reshape(-1,2)],complex)/np.sqrt(2)
def qpsk_demod(s):
 out=[]
 for z in s:
  out += [0,0] if z.real>=0 and z.imag>=0 else [0,1] if z.real<0 and z.imag>=0 else [1,1] if z.real<0 else [1,0]
 return np.array(out,int)
def awgn(x,snr):
 p=np.mean(abs(x)**2); npow=p/(10**(snr/10))
 return x+np.sqrt(npow/2)*(np.random.randn(*x.shape)+1j*np.random.randn(*x.shape))
def simulate_ofdm(number_of_bits=1000,cp_length=16,snr_db=10,subcarriers=64):
 if subcarriers!=64: raise ValueError('This project uses fixed 64-point OFDM.')
 if number_of_bits<1 or number_of_bits>100000: raise ValueError('Bits must be 1 to 100000.')
 if not 1<=cp_length<64: raise ValueError('Cyclic Prefix must be 1 to 63.')
 if not -20<=snr_db<=50: raise ValueError('SNR must be -20 to 50 dB.')
 txbits=np.random.randint(0,2,number_of_bits); q=qpsk_mod(txbits)
 ns=int(np.ceil(len(q)/len(DATA))); q=np.r_[q,np.zeros(ns*len(DATA)-len(q),complex)]
 ptr=0; time=[]; eq=[]
 for _ in range(ns):
  fd=np.zeros(64,complex); fd[[idx(k) for k in PILOTS]]=PV
  block=q[ptr:ptr+len(DATA)];ptr+=len(DATA)
  fd[[idx(k) for k in DATA]]=block
  td=np.fft.ifft(fd)*np.sqrt(64); tx=np.r_[td[-cp_length:],td]; rx=awgn(tx,snr_db)[cp_length:]
  rf=np.fft.fft(rx)/np.sqrt(64)
  pr=np.array([rf[idx(k)] for k in PILOTS]); est=pr/PV
  h=np.interp(ACTIVE,PILOTS,est.real)+1j*np.interp(ACTIVE,PILOTS,est.imag)
  ar=np.array([rf[idx(k)] for k in ACTIVE]); h=np.where(abs(h)<1e-8,1+0j,h)
  ae=ar/h; eq.extend([ae[np.where(ACTIVE==k)[0][0]] for k in DATA]);time.extend(tx)
 rb=qpsk_demod(np.array(eq))[:number_of_bits];ber=float(np.mean(txbits!=rb))
 return {'ber':ber,'time_signal':np.asarray(time),'equalized_symbols':np.asarray(eq),'ofdm_symbols':ns}
