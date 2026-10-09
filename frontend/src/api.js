const API_URL = "http://127.0.0.1:8000/api/simulate/";

export async function runSimulation(parameters) {
  const formData = new FormData();

  formData.append("bits", parameters.bits);
  formData.append("cp", parameters.cp);
  formData.append("snr", parameters.snr);

  const response = await fetch(API_URL, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || "Simulation failed.");
  }

  return data;
}