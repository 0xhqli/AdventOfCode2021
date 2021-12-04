import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;
import java.util.ArrayList;
import java.util.Arrays;

class Day3{
    public static void main(String[] args){
        try {
            File myObj = new File("Day3Input.txt");
            Scanner Input = new Scanner(myObj);
            ArrayList<String> data=new ArrayList<>();
            while (Input.hasNextLine()) {
                data.add(Input.nextLine());
                // System.out.println(data);
            }
            Input.close();
            String[] resRates=getRates(data);
            System.out.println(Arrays.toString(resRates));
            int gamma=Integer.parseInt(resRates[0],2);
            int epsilon=Integer.parseInt(resRates[1],2);
            int OxyRatings=Integer.parseInt(getRatings(data,true),2);
            int CarbRatings=Integer.parseInt(getRatings(data,false),2);
            System.out.println("Oxy: "+OxyRatings+"  Carb: "+CarbRatings+"  Prod: "+(OxyRatings*CarbRatings));
            System.out.println("Gamma: "+gamma+"  Epsilon: "+epsilon+"  Prod: "+(gamma*epsilon));
        }
        catch (FileNotFoundException e) {
            System.out.println("An error occurred.");
            e.printStackTrace();
        }
    }
    public static String[] getRates(ArrayList<String> data){
        String result[]={"",""};
        if(data.size()>0){
            int dataLength=data.get(0).length();
            int[] t=new int[dataLength];
            int[] f=new int[dataLength];
            for(String x: data){
                for(int i=0;i<dataLength;i++){
                    if(x.charAt(i)=='1') t[i]++;
                    else f[i]++;
                }
            }
            for(int i=0;i<dataLength;i++){
                if(t[i]<f[i]){
                    result[0]+="0";
                    result[1]+="1";
                }
                else{
                    result[0]+="1";
                    result[1]+="0";
                }
            }
            // System.out.println(Arrays.toString(t));
            // System.out.println(Arrays.toString(f));
        }
        return result;
    }
    public static String getRatings(ArrayList<String> data, boolean o){
        String result="";
        int dataLength=data.get(0).length();
        int i=0;
        while(data.size()>1&&i<dataLength){
            int t=0;
            int f=0;
            for(String x: data){
                if(x.charAt(i)=='1') t++;
                else f++;
            }
            ArrayList<String> filtered=new ArrayList<>();
            char filter;
            if(o){
                filter='1';
                if(t<f) filter='0';
            }
            else{
                filter='0';
                if(t<f) filter='1';
            }
            for(String x: data){
                if(x.charAt(i)==filter) filtered.add(x);
            }
            data=filtered;
            // System.out.println(t+":"+f+"+"+data);
            i++;
        }
        if(data.size()==1)return data.get(0);
        return result;
    }
}