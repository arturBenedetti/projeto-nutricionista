// backend/Backend.java
import java.util.Scanner;
// import java.util.HashMap;
// import java.util.Map;
//import com.google.gson.Gson;

public class Backend {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("teste");
        //Gson gson = new Gson();

        // while (scanner.hasNextLine()) {
        //     String input = scanner.nextLine();
        //     try {
        //         //Map<String, Object> request = gson.fromJson(input, Map.class);
        //         // String action = (String) request.get("action");

        //         // Map<String, Object> response = new HashMap<>();
        //         // if ("somar".equals(action)) {
        //         //     double a = ((Number) request.get("a")).doubleValue();
        //         //     double b = ((Number) request.get("b")).doubleValue();
        //         //     response.put("resultado", a + b);
        //         // } else {
        //         //     response.put("erro", "Ação desconhecida: " + action);
        //         // }

        //         System.out.println("teste");
        //         System.out.flush(); // força envio da resposta
        //     } catch (Exception e) {
        //         System.out.println("{\"erro\": \"Formato inválido\"}");
        //         System.out.flush();
        //     }
        // }

        scanner.close();
    }
}
